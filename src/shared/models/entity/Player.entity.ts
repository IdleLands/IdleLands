
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { sample, pickBy, clone, includes, without, uniqBy } from 'lodash';
import { RestrictedNumber } from 'restricted-number';
import { nonenumerable } from 'nonenumerable';

import { Statistics } from './Statistics.entity';
import { Inventory } from './Inventory.entity';
import { Choices } from './Choices.entity';

import { BaseProfession } from '../../../server/core/game/professions/Profession';
import { Item } from '../Item';
import { IGame, Stat, IPlayer, ItemSlot, ServerEventName,
  IAdventureLog, AdventureLogEventType, AchievementRewardType, Direction,
  IBuff, Channel, IParty, PermanentPetUpgrade, ItemClass } from '../../interfaces';
import { SHARED_FIELDS } from '../../../server/core/game/shared-fields';
import { Choice } from '../Choice';
import { Achievements } from './Achievements.entity';
import { Personalities } from './Personalities.entity';
import { Collectibles } from './Collectibles.entity';
import { Pets } from './Pets.entity';
import { Premium } from './Premium.entity';

// 5 minutes on prod, 5 seconds on dev
const STAMINA_TICK_BOOST = process.env.NODE_ENV === 'production' ? 300000 : 5000;

/**
 * Note: some attributes are @nonenumerable, while others are prefixed with $.
 * @nonenumerable attributes are not sending updates to the client, and they also do not get sent to the DB.
 * $ attributes are not saved to the DB, but are sent to the client unless marked with @nonenumerable.
 *
 * To save a @nonenumerable attr to the DB, DatabaseManager#savePlayer must be updated to manually copy these fields.
 * $ attributes should never be saved to the DB, and are prefixed as such because it directly conflicts with MongoDB.
 *
 * Sadly, getters just don't work.
 */

@Entity()
export class Player implements IPlayer {

  // internal vars
  @nonenumerable
  @ObjectIdColumn() public _id: string;

  @nonenumerable
  private $game: IGame;

  public get $$game(): IGame {
    return this.$game;
  }

  @Index({ unique: true })
  @Column() public userId: string;
  @Column() public currentUserId: string;

  @Column() public authId: string;
  @Column() public authSyncedTo: string;
  @Column() public authType: string;

  @Column() public createdAt: number;
  @Column() public loggedIn: boolean;

  // player-related vars
  @Index({ unique: true })
  @Column() public name: string;
  @Column() public ascensionLevel: number;
  @Column() public lastAscension: number;
  @Column() public level: RestrictedNumber;
  @Column() public xp: RestrictedNumber;
  @Column() public profession: string;
  @Column() public gender: string;
  @Column() public title: string;
  @Column() public map: string;
  @Column() public region: string;
  @Column() public x: number;
  @Column() public y: number;
  @Column() public gold: number;
  @Column() public eventSteps: number;

  @Column() public stamina: RestrictedNumber;
  @Column() public nextStaminaTick: number;

  @Column() public stepCooldown: number;

  @Column() public lastDir: Direction;
  @Column() public divineDirection: { x: number, y: number, steps: number };

  @Column() public buffWatches: { [key in Stat]?: IBuff[] };

  // non-saved player vars
  // still serialized to the client
  public sessionId: string;

  private stats: any;
  public $statTrail: any;

  // joined vars
  // not serialized to the client
  @nonenumerable
  public $profession: BaseProfession;
  public $professionData: any;

  @nonenumerable
  public $statistics: Statistics;
  public $statisticsData: any;

  @nonenumerable
  public $inventory: Inventory;
  public $inventoryData: any;

  @nonenumerable
  public $choices: Choices;
  public $choicesData: any;

  @nonenumerable
  public $achievements: Achievements;
  public $achievementsData: any;

  @nonenumerable
  public $personalities: Personalities;
  public $personalitiesData: any;

  @nonenumerable
  public $collectibles: Collectibles;
  public $collectiblesData: any;

  @nonenumerable
  public $pets: Pets;
  public $petsData: any;

  @nonenumerable
  public $premium: Premium;
  public $premiumData: any;

  @Column()
  public availableGenders: string[];

  @Column()
  public availableTitles: string[];

  public $party?: IParty;

  init() {
    // validate that important properties exist
    if(!this.createdAt) this.createdAt = Date.now();
    if(!this.availableGenders) this.availableGenders = ['male', 'female', 'not a bear', 'glowcloud', 'astronomical entity', 'soap'];
    if(!this.availableTitles) this.availableTitles = [];
    if(!this.level) this.level = new RestrictedNumber(1, 100, 1);
    if(!this.xp) this.xp = new RestrictedNumber(0, 100, 0);
    if(!this.profession) this.profession = 'Generalist';
    if(!this.gender) this.gender = sample(this.availableGenders);
    if(!this.map) this.map = 'Norkos';
    if(!this.x) this.x = 10;
    if(!this.y) this.y = 10;
    if(!this.ascensionLevel) this.ascensionLevel = 0;
    if(!this.gold) this.gold = 0;
    if(!this.stamina) this.stamina = new RestrictedNumber(0, 10, 10);
    if(!this.nextStaminaTick) this.nextStaminaTick = Date.now();
    if(!this.stats) this.stats = {};
    if(!this.$statTrail) this.$statTrail = {};
    if(!this.buffWatches) this.buffWatches = {};

    if(!this.$profession) {
      this.changeProfessionWithRef(this.profession);
    }

    // init the prototypes that exist
    SHARED_FIELDS.forEach(({ name, proto }) => {
      if(this[`$${name}`]) return;

      this[`$${name}`] = new proto();
      this[`$${name}`].setOwner(this);
    });

    // reset some aspects
    this.level = new RestrictedNumber(this.level.minimum, this.level.maximum, this.level.__current);
    this.xp = new RestrictedNumber(this.xp.minimum, this.xp.maximum, this.xp.__current);
    this.stamina = new RestrictedNumber(this.stamina.minimum, this.stamina.maximum, this.stamina.__current);
    this.calculateStamina();
    this.checkStaminaTick();

    // init extra data for relevant joined services
    this.$professionData = this.$profession.$professionData;
    this.initLinks();

    // copy all the data to us
    this.copyLinkedDataToSelf();

    this.increaseStatistic('Game/Logins', 1);

    this.recalculateStats();

    this.syncPremium();
  }

  public copyLinkedDataToSelf() {
    SHARED_FIELDS.forEach(({ name }) => {
      this[`$${name}Data`] = this[`$${name}`][`$${name}Data`];
    });
  }

  public toSaveObject(): any {
    return pickBy(this, (value, key) => !key.startsWith('$'));
  }

  public fullName(): string {
    if(this.title) return `${this.name}, the ${this.title}`;
    return this.name;
  }

  async loop(): Promise<void> {

    this.increaseStatistic('Character/Ticks', 1);

    this.gainXP(0);
    this.gainGold(0);
    this.checkStaminaTick();

    this.$game.movementHelper.takeStep(this);
    this.$game.eventManager.tryToDoEventFor(this);

    if(this.divineDirection) {
      this.divineDirection.steps--;
      if(this.divineDirection.steps <= 0) this.divineDirection = null;
    }

    this.$pets.loop();

    this.$game.playerManager.updatePlayer(this);
  }

  public getStat(stat: Stat): number {
    return this.stats[stat];
  }

  public oocAction(): string {
    if(this.stamina.total < this.$profession.oocAbilityCost) return;

    this.increaseStatistic('Character/Stamina/Spend', this.$profession.oocAbilityCost);
    this.increaseStatistic(`Profession/${this.profession}/AbilityUses`, 1);

    this.stamina.sub(this.$profession.oocAbilityCost);
    return this.$profession.oocAbility(this);
  }

  public petOOCAction(): string {
    if(this.stamina.total < this.$pets.$activePet.$attribute.oocAbilityCost) return;

    this.increaseStatistic('Character/Stamina/Spend', this.$pets.$activePet.$attribute.oocAbilityCost);
    this.increaseStatistic(`Pet/AbilityUses/Attribute/${this.$pets.$activePet.attribute}`, 1);
    this.increaseStatistic(`Pet/AbilityUses/Pet/${this.$pets.$activePet.typeName}`, 1);

    this.stamina.sub(this.$pets.$activePet.$attribute.oocAbilityCost);
    return this.$pets.$activePet.$attribute.oocAbility(this);
  }

  public canLevelUp(): boolean {
    return !this.level.atMaximum();
  }

  public gainXP(xp = 0, addMyXP = true): number {

    let remainingXP = addMyXP ? Math.floor(xp + this.stats.xp) : xp;
    const totalXP = remainingXP;

    if(remainingXP < 0) {
      this.xp.add(remainingXP);
      this.increaseStatistic('Character/Experience/Lose', -remainingXP);
      return remainingXP;
    }

    // always gain profession xp, even if you are level blocked
    this.increaseStatistic(`Profession/${this.profession}/Experience`, remainingXP);

    while(remainingXP > 0 && this.canLevelUp()) {
      this.increaseStatistic('Character/Experience/Gain', remainingXP);
      const preAddXP = this.xp.total;
      this.xp.add(remainingXP);

      const xpDiff = this.xp.total - preAddXP;
      remainingXP -= xpDiff;

      this.tryLevelUp();
    }

    return totalXP;
  }

  public spendGold(gold = 0): number {
    this.increaseStatistic('Character/Gold/Spend', gold);
    return this.gainGold(-gold);
  }

  public gainGold(gold = 0, addMyGold = true): number {

    const remainingGold = addMyGold ? Math.floor(gold + this.stats.gold) : gold;

    if(remainingGold < 0) {
      this.gold += remainingGold;
      this.increaseStatistic('Character/Gold/Lose', -remainingGold);
      this.gold = Math.max(0, this.gold);
      return remainingGold;
    }

    this.increaseStatistic('Character/Gold/Gain', remainingGold);
    this.gold += remainingGold;

    return remainingGold;
  }

  public ascend(): void {
    if(this.canLevelUp()) return;

    this.lastAscension = Date.now();
    this.ascensionLevel = this.ascensionLevel || 0;
    this.ascensionLevel++;

    this.level.minimum = 1;
    this.level.set(1);

    this.xp.set(0);
    this.xp.maximum = this.calcLevelMaxXP(1);

    this.gainILP(this.level.maximum);

    this.increaseStatistic('Character/Ascension/Levels', this.level.maximum);
    this.level.maximum = this.level.maximum + (this.ascensionLevel * 10);

    this.increaseStatistic('Character/Ascension/Gold', this.gold);
    this.gold = 0;

    this.increaseStatistic('Character/Ascension/ItemScore', this.$inventory.totalItemScore());
    const items = this.$game.itemGenerator.generateNewbieItems();
    items.forEach(item => this.$inventory.equipItem(item));
    this.$inventory.clearInventory();

    this.increaseStatistic('Character/Ascension/Times', 1);

    this.$collectibles.resetFoundAts();

    this.recalculateStats();
  }

  private checkStaminaTick() {
    if(this.stamina.atMaximum() || Date.now() < this.nextStaminaTick) return;

    this.increaseStatistic('Character/Stamina/Gain', 1);
    this.stamina.add(1);
    this.nextStaminaTick = Date.now() + STAMINA_TICK_BOOST;
  }

  private calculateStamina() {
    const level = this.level.total;

    // base of 8 (because you start level 1, which is a free +2)
    let staminaTotal = 8;

    // +2 stamina for the first 20 levels
    staminaTotal += Math.max(1, Math.min(level, 20)) * 2;

    // +1 stamina for levels 21-80
    staminaTotal += Math.max(0, Math.min(level - 20, 80));

    // 0.5 stamina for levels 100-200
    staminaTotal += Math.floor(Math.max(0, Math.min(level - 100, 100)) * 0.5);

    // ascensionLevel^2 bonus to stamina
    staminaTotal += this.ascensionLevel * this.ascensionLevel;

    this.stamina.maximum = staminaTotal;
  }

  private calcLevelMaxXP(level: number): number {
    return Math.floor(100 + (50 * Math.pow(level, 1.65)));
  }

  private tryLevelUp(): void {
    if(!this.xp.atMaximum()) return;
    this.level.add(1);

    this.gainILP(1);

    this.xp.toMinimum();
    this.resetMaxXP();

    this.increaseStatistic('Character/Experience/Levels', 1);
    this.calculateStamina();
  }

  public resetMaxXP(): void {
    this.xp.maximum = this.calcLevelMaxXP(this.level.total);
  }

  private addStatTrail(stat: Stat, val: number, reason: string) {
    if(val === 0) return;

    val = Math.floor(val);

    this.stats[stat] = this.stats[stat] || 0;
    this.stats[stat] += val;
    this.$statTrail[stat] = this.$statTrail[stat] || [];
    this.$statTrail[stat].push({ val, reason });
  }

  public recalculateStats(): void {
    if(!this.$inventoryData) return;

    this.stats = {};
    this.$statTrail = {};

    this.stats.specialName = this.$profession.specialStatName;

    // dynamically-calculated
    // first, we do the addition-based adds
    const allStats = Object.keys(Stat).map(key => Stat[key]);
    allStats.forEach(stat => {

      this.stats[stat] = this.stats[stat] || 0;

      // item adds
      Object.keys(this.$inventoryData.equipment).forEach(itemSlot => {
        const item = this.$inventory.itemInEquipmentSlot(<ItemSlot>itemSlot);
        if(!item || !item.stats[stat]) return;

        this.addStatTrail(stat, item.stats[stat], `Item: ${item.name}`);
      });

      // achievement adds
      Object.keys(this.$achievementsData.achievements).forEach(achName => {
        const ach = this.$achievementsData.achievements[achName];
        ach.rewards.forEach(reward => {
          if(reward.type !== AchievementRewardType.Stats || !reward.stats[stat]) return;
          this.addStatTrail(stat, reward.stats[stat], `Achieve#: ${achName} (t${ach.tier})`);
        });
      });

      // buff adds
      Object.keys(this.buffWatches).forEach(buffKey => {
        this.buffWatches[buffKey].forEach((buff: IBuff) => {
          if(!buff.stats[stat]) return;
          this.addStatTrail(stat, buff.stats[stat], `Buff: ${buff.name}`);
        });
      });

      // stats per level boost
      const profBasePerLevel = this.$profession.calcLevelStat(this, stat);
      this.addStatTrail(stat, profBasePerLevel, `${this.profession}: Base / Lv. (${profBasePerLevel / this.level.total})`);


      // make sure it is 0. no super negatives.
      this.stats[stat] = Math.max(0, this.stats[stat]);
    });

    const personalityInstances = this.getActivePersonalityInstances();

    // here we do the multiplicative adds
    allStats.forEach(stat => {

      const statBase = this.stats[stat];

      // stat profession multiplier boost
      const profMult = this.$profession.calcStatMultiplier(stat);
      if(profMult > 1) {
        const addedValue = Math.floor((statBase * profMult)) - statBase;
        this.addStatTrail(stat, addedValue, `${this.profession} Mult. (${profMult.toFixed(1)}x)`);
      } else if(profMult < 1) {
        const lostValue = statBase - Math.floor(statBase * profMult);
        this.addStatTrail(stat, -lostValue, `${this.profession} Mult. (${profMult.toFixed(1)}x)`);
      }

      // achievement multiplier boost
      Object.keys(this.$achievementsData.achievements).forEach(achName => {
        const ach = this.$achievementsData.achievements[achName];
        ach.rewards.forEach(reward => {
          if(reward.type !== AchievementRewardType.StatMultipliers || !reward.stats[stat]) return;

          const addedValue = Math.floor((statBase * reward.stats[stat])) - statBase;
          this.addStatTrail(stat, addedValue, `Achieve%: ${achName} (t${ach.tier})`);
        });
      });

      // personality multiplier boost
      personalityInstances.forEach(pers => {
        if(!pers.statMultipliers || !pers.statMultipliers[stat]) return;

        const addedValue = Math.floor((statBase * pers.statMultipliers[stat])) - statBase;
        this.addStatTrail(stat, addedValue, `Personality: ${pers.name}`);
      });
    });

    // next we do specific-adds from the profession
    // we do these last, despite being additive, because they rely heavily on the stats from before
    const copyStats = clone(this.stats);
    allStats.forEach(checkStat => {
      const profBoosts = this.$profession.calcStatsForStats(copyStats, checkStat);
      profBoosts.forEach(({ stat, boost, tinyBoost }) => {
        this.addStatTrail(checkStat, boost, `${this.profession} ${checkStat.toUpperCase()} / ${stat.toUpperCase()} (${tinyBoost})`);
      });
    });

    // base values
    this.stats.hp = Math.max(1, this.stats.hp);
    this.stats.xp = Math.max(1, this.stats.xp);
    this.stats.gold = Math.max(0, this.stats.gold);
  }

  private initLinks() {
    this.$inventory.init(this);

    if(this.$inventory.isNeedingNewbieItems()) {
      const items = this.$game.itemGenerator.generateNewbieItems();
      items.forEach(item => this.equip(item));
    }

    this.$achievements.init(this);
    this.$choices.init(this);
    this.$pets.init(this);

    this.$game.achievementManager.syncAchievements(this);
    this.syncTitles();
    this.syncGenders();
    this.syncPersonalities();
  }

  public equip(item: Item, failOnInventoryFull = true): boolean {
    const oldItem = this.$inventory.itemInEquipmentSlot(item.type);
    if(oldItem) {
      const successful = this.unequip(oldItem, failOnInventoryFull);
      if(!successful) return false;
    }

    this.increaseStatistic('Item/Equip/Times', 1);

    this.$inventory.equipItem(item);
    this.recalculateStats();
    return true;
  }

  // primarily used for providences
  public forceUnequip(item: Item): void {
    this.$inventory.unequipItem(item);
    this.recalculateStats();
  }

  public unequip(item: Item, failOnInventoryFull = false): boolean {
    if(failOnInventoryFull && !this.$inventory.canAddItemsToInventory()) return false;

    this.$inventory.unequipItem(item);
    this.recalculateStats();

    this.increaseStatistic('Item/Unequip/Times', 1);

    if(this.$inventory.canAddItemsToInventory()) {
      this.$inventory.addItemToInventory(item);
    } else {
      this.sellItem(item);
    }

    return true;
  }

  public alwaysTryAddToInventory(item: Item): void {

    // if we cannot add to inventory
    if(!this.$inventory.canAddItemsToInventory()) {

      // check for any number of unlocked items we can sell
      const unlocked = this.$inventory.unlockedItems();

      // if we find one, sell it
      if(unlocked.length > 0) {
        this.$inventory.removeItemFromInventory(unlocked[0]);
        this.sellItem(unlocked[0]);
        this.$inventory.addItemToInventory(item);
        return;
      }

      // if we can't find anything, just sell it
      this.sellItem(item);
      return;
    }

    // if we have space, obviously just add it
    this.$inventory.addItemToInventory(item);
  }

  public sellItem(item: Item): number {
    const value = item.score;
    const modValue = this.gainGold(value);
    this.increaseStatistic('Item/Sell/Times', 1);
    this.increaseStatistic('Item/Sell/GoldGain', modValue);

    return modValue;
  }

  public doChoice(choice: Choice, decisionIndex: number) {
    const decision = choice.choices[decisionIndex];
    const shouldRemove = this.$game.eventManager.doChoiceFor(this, choice, decision);

    this.$choices.makeDecision(this, choice, decisionIndex, shouldRemove);
  }

  public emit(evt: ServerEventName, data: any): void {
    this.$game.playerManager.emitToPlayer(this.name, evt, data);
  }

  public increaseStatistic(stat: string, val: number): void {
    this.$statistics.increase(stat, val);
    const newAchievements = this.$game.achievementManager.checkAchievementsFor(this, stat);

    if(newAchievements.length > 0) {
      this.recalculateStats();

      newAchievements.forEach(ach => {
        const messageData: IAdventureLog = {
          when: Date.now(),
          type: AdventureLogEventType.Achievement,
          message: `${this.fullName()} has achieved ${ach.name} tier ${ach.tier}!`
        };

        this.$game.subscriptionManager.emitToChannel(Channel.PlayerAdventureLog, { playerNames: [this.name], data: messageData });
      });

      this.syncTitles();
      this.syncGenders();
      this.syncPersonalities();

      this.$pets.syncBuyablePets(this);
    }

    let shouldRecalc = false;

    const allBuffWatches = this.buffWatches[stat];
    if(allBuffWatches) {
      allBuffWatches.forEach(buff => {
        buff.duration--;
        if(buff.duration <= 0) {
          this.buffWatches[stat] = without(allBuffWatches, buff);
          shouldRecalc = true;
        }
      });

      if(this.buffWatches[stat].length === 0) delete this.buffWatches[stat];
    }

    if(shouldRecalc) {
      this.recalculateStats();
    }

  }

  public togglePersonality(pers: string): boolean {
    if(!this.$personalities.has(pers)) return false;

    this.$personalities.toggle(this.$game.personalityManager.get(pers));
    this.recalculateStats();

    return true;
  }

  public getDefaultChoice(choices: string[]): string {
    if(this.$personalities.isActive('Denier') && includes(choices, 'No')) return 'No';
    if(this.$personalities.isActive('Affirmer') && includes(choices, 'Yes')) return 'Yes';
    if(this.$personalities.isActive('Indecisive')) return sample(choices);
    return 'Yes';
  }

  public hasPersonality(pers: string): boolean {
    return this.$personalities.has(pers);
  }

  private getPersonalityInstances() {
    return this.$achievements.getPersonalities().map(pers => this.$game.personalityManager.get(pers));
  }

  private getActivePersonalityInstances() {
    return this.getPersonalityInstances().filter(pers => this.$personalities.isActive(pers.name));
  }

  private syncTitles() {
    this.availableTitles = this.$achievements.getTitles();
  }

  private syncGenders() {
    this.availableGenders = this.$achievements.getGenders();
  }

  private syncPersonalities() {
    this.$personalities.resetPersonalitiesTo(this.getPersonalityInstances());
  }

  public syncPremium() {
    const tier = this.$premiumData.tier;

    this.$statistics.set('Game/Premium/Tier', tier);

    this.$statistics.set('Game/Premium/AdventureLogSize',
      25 + (tier * 25) + this.$pets.getTotalPermanentUpgradeValue(PermanentPetUpgrade.AdventureLogSizeBoost));
    this.$statistics.set('Game/Premium/InventorySize',
      10 + (tier * 10) + this.$pets.getTotalPermanentUpgradeValue(PermanentPetUpgrade.InventorySizeBoost));
    this.$statistics.set('Game/Premium/SoulStashSize',
      0 + (tier * 5) + this.$pets.getTotalPermanentUpgradeValue(PermanentPetUpgrade.SoulStashSizeBoost));
    this.$statistics.set('Game/Premium/ChoiceLogSize',
      10 + (tier * 10) + this.$pets.getTotalPermanentUpgradeValue(PermanentPetUpgrade.ChoiceLogSizeBoost));
    this.$statistics.set('Game/Premium/ItemStatCap',
      300 + (tier * 100) + this.$pets.getTotalPermanentUpgradeValue(PermanentPetUpgrade.ItemStatCapBoost));
    this.$statistics.set('Game/Premium/EnchantCap',
      10 + (tier) + this.$pets.getTotalPermanentUpgradeValue(PermanentPetUpgrade.EnchantCapBoost));
  }

  public gainILP(ilp: number): void {
    this.$premium.gainILP(ilp);
  }

  public changeProfessionWithRef(prof: string): void {
    this.changeProfession(this.$game.professionHelper.getProfession(prof));
  }

  public changeProfession(prof: BaseProfession): void {
    this.$profession = prof;
  }

  public hasAchievement(achi: string): boolean {
    return !!this.$achievements.getAchievementAchieved(achi);
  }

  private collectibleRarityILPValue(rarity: ItemClass) {
    switch(rarity) {
      case ItemClass.Newbie:  return 1;
      case ItemClass.Basic:   return 2;
      case ItemClass.Pro:     return 3;
      case ItemClass.Idle:    return 4;
      case ItemClass.Godly:   return 5;
      case ItemClass.Goatly:  return 7;
      case ItemClass.Omega:   return 10;
      default:                return 1;
    }
  }

  public tryFindCollectible({ name, rarity, description, storyline }) {

    this.increaseStatistic('Item/Collectible/Touch', 1);

    let currentCollectible = this.$collectibles.get(name);

    // create a new collectible
    if(!currentCollectible) {
      currentCollectible = {
        name: name,
        map: this.map,
        region: this.region,
        rarity,
        description,
        storyline,
        count: 0,
        touched: 0,
        foundAt: 0
      };

      this.$collectibles.add(currentCollectible);
    }

    // if it doesn't have found-at, set it + count++ it
    if(!currentCollectible.foundAt) {
      currentCollectible.foundAt = Date.now();
      currentCollectible.count++;

      this.increaseStatistic('Item/Collectible/Find', 1);

      this.gainILP(this.collectibleRarityILPValue(currentCollectible.rarity));

      const messageData: IAdventureLog = {
        when: Date.now(),
        type: AdventureLogEventType.Item,
        message: `${this.fullName()} found "${currentCollectible.name}" in ${this.map} - ${this.region || 'Wilderness'}!`
      };

      this.$game.subscriptionManager.emitToChannel(Channel.PlayerAdventureLog, { playerNames: [this.name], data: messageData });

    }

    // always touch it
    currentCollectible.touched++;
  }

  public hasCollectible(coll: string): boolean {
    return this.$collectibles.has(coll);
  }

  public grantBuff(buff: IBuff, canShare = false): void {
    this.increaseStatistic(`Character/${buff.booster ? 'Booster' : 'Injury'}/Give`, 1);

    if(this.$party && canShare) {
      this.increaseStatistic(`Character/${buff.booster ? 'Booster' : 'Injury'}/Give`, this.$party.members.length - 1);
      this.$game.buffManager.shareBuff(this, buff);
    }

    this.addBuff(buff);
  }

  public addBuff(buff: IBuff): void {
    this.increaseStatistic(`Character/${buff.booster ? 'Booster' : 'Injury'}/Receive`, 1);

    this.buffWatches[buff.statistic] = this.buffWatches[buff.statistic] || [];
    this.buffWatches[buff.statistic].unshift(buff);
    this.buffWatches[buff.statistic] = uniqBy(this.buffWatches[buff.statistic], (checkBuff: IBuff) => checkBuff.name);
    delete buff.statistic;

    this.recalculateStats();
    this.$pets.$activePet.recalculateStats();
  }

  public setPos(x: number, y: number, map: string, region: string): void {
    const oldMap = this.map;

    this.x = x;
    this.y = y;
    this.map = map;
    this.region = region;

    if(this.map !== oldMap) this.divineDirection = null;
  }

  public setDivineDirection(x: number, y: number): void {
    if(this.divineDirection || x === 0 || y === 0) {
      this.divineDirection = null;
      return;
    }

    this.divineDirection = { x, y, steps: 360 };
  }

  public changeGender(gender: string) {
    this.gender = gender;
    this.$game.sendClientUpdateForPlayer(this);
  }

  public changeTitle(title: string) {
    this.title = title;
    this.$game.sendClientUpdateForPlayer(this);
  }

  public tryToDoNewCharacter() {
    const canDo = this.$choices.$choicesData.choices.length === 0 && this.$statistics.get('Character/Choose/Total') === 0;
    if(!canDo) return;

    this.$game.doStartingPlayerStuff(this);
  }
}
