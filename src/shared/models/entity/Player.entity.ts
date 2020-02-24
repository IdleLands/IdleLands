
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { sample, pickBy, clone, includes, without, uniqBy, capitalize } from 'lodash';
import { RestrictedNumber } from 'restricted-number';
import { nonenumerable } from 'nonenumerable';

import { Statistics } from './Statistics.entity';
import { Inventory } from './Inventory.entity';
import { Choices } from './Choices.entity';

import { BaseProfession } from '../../../server/core/game/professions/Profession';
import { Item } from '../Item';
import { IGame, Stat, IPlayer, ItemSlot, ServerEventName,
  IAdventureLog, AdventureLogEventType, AchievementRewardType, Direction,
  IBuff, Channel, IParty, PermanentUpgrade, ItemClass, Profession, ModeratorTier,
  IPet, PremiumTier, ContributorTier } from '../../interfaces';
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
  @Column() public banned: boolean;
  @Column() public ips: string[];
  @Column() public ip: string;

  @Column() public authId: string;
  @Column() public authSyncedTo: string;
  @Column() public authType: string;
  @Column() public modTier: ModeratorTier;
  @Column() public mutedUntil: number;
  @Column() public guildAppBanned: boolean;
  @Column() public lastMessageSent: number;
  @Column() public messageCooldown: number;

  @Column() public discordTag: string;
  @Column() public il3CharName: string;

  @Column() public createdAt: number;
  @Column() public loggedIn: boolean;
  @Column() public lastOnline: number;

  // player-related vars
  @Index({ unique: true })
  @Column() public name: string;
  @Column() public hardcore: boolean;
  @Column() public dead: boolean;
  @Column() public ascensionLevel: number;
  @Column() public lastAscension: number;
  @Column() public level: RestrictedNumber;
  @Column() public xp: RestrictedNumber;
  @Column() public profession: Profession;
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
  @Column() public cooldowns: { [key: string]: number };
  @Column() public lastLoc: { map: string, x: number, y: number };

  @Column() public guildName?: string;

  // non-saved player vars
  // still serialized to the client
  public sessionId: string;

  private stats: any;

  public get currentStats() {
    return this.stats;
  }

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

  @nonenumerable
  public $quests: any;
  public $questsData: any;

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
    if(!this.profession) this.profession = Profession.Generalist;
    if(!this.gender) this.gender = sample(this.availableGenders);
    if(!this.map) this.map = 'Norkos';
    if(!this.x) this.x = 10;
    if(!this.y) this.y = 10;
    if(!this.ascensionLevel) this.ascensionLevel = 0;
    if(!this.gold) this.gold = 0;
    if(!this.stamina) this.stamina = new RestrictedNumber(0, 10, 10);
    if(!this.nextStaminaTick) this.nextStaminaTick = Date.now();
    if(!this.stats) this.stats = { };
    if(!this.$statTrail) this.$statTrail = { };
    if(!this.buffWatches) this.buffWatches = { };
    if(!this.cooldowns) this.cooldowns = { };
    if(!this.hardcore) this.hardcore = false;

    delete (this as any).bossTimers;
    delete this.buffWatches['undefined'];

    this.clearOldCooldowns();

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

    // init extra data for relevant joined services
    this.$professionData = this.$profession.$professionData;
    this.initLinks();

    // copy all the data to us
    this.copyLinkedDataToSelf();

    this.increaseStatistic('Game/Logins', 1);

    this.validateGuild();

    this.recalculateStats();

    this.calculateStamina();
    this.checkStaminaTick();

    this.setDiscordTag(this.discordTag);
    this.syncPremium();

    if(this.title && !this.availableTitles.includes(this.title)) {
      this.changeTitle('');
    }

    if(this.hardcore) {
      this.$statistics.set('Game/Hardcore', 1);
      if(this.$statistics.get(`Hardcore/Dead`)) this.dead = true;
    }
  }

  private validateGuild() {
    if(!this.guildName) return;

    const guild = this.$$game.guildManager.getGuild(this.guildName);
    if(!guild || !guild.members[this.name]) {
      this.guildName = '';
    }
  }

  private clearOldCooldowns() {
    const now = Date.now();
    Object.keys(this.cooldowns).forEach(cooldown => {
      if(this.cooldowns[cooldown] > now) return;
      delete this.cooldowns[cooldown];
    });
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

  async loop(tick: number): Promise<void> {

    if(this.hardcore && this.$statistics.get('Hardcore/Dead') === 1) return;

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

    if(this.mutedUntil < Date.now()) this.mutedUntil = 0;

    this.$pets.loop(tick, this);

    this.$game.playerManager.updatePlayer(this);
  }

  public getStat(stat: Stat): number {
    return this.stats[stat];
  }


  public oocAction(costMultiplier = 1): { success: boolean, message: string } {
    const totalCost = this.$profession.oocAbilityCost * costMultiplier;
    if(this.stamina.total < totalCost) return { success: false, message: `You do not have enough stamina!` };

    const response = this.$profession.oocAbility(this);
    if(!response.success) return response;

    if(this.stamina.total < totalCost) return;

    this.increaseStatistic('Character/Stamina/Spend', totalCost);
    this.increaseStatistic(`Profession/${this.profession}/AbilityUses`, 1);


    this.stamina.sub(totalCost);

    return response;
  }

  public petOOCAction(): { success: boolean, message: string } {
    if(this.stamina.total < this.$pets.$activePet.$attribute.oocAbilityCost) return;

    this.increaseStatistic('Character/Stamina/Spend', this.$pets.$activePet.$attribute.oocAbilityCost);
    this.increaseStatistic(`Pet/AbilityUses/Total`, 1);
    this.increaseStatistic(`Pet/AbilityUses/Attribute/${this.$pets.$activePet.attribute}`, 1);
    this.increaseStatistic(`Pet/AbilityUses/Pet/${this.$pets.$activePet.typeName}`, 1);

    this.stamina.sub(this.$pets.$activePet.$attribute.oocAbilityCost);
    return this.$pets.$activePet.$attribute.oocAbility(this);
  }

  public canLevelUp(): boolean {
    return !this.level.atMaximum();
  }

  public gainXP(xp = 0, addMyXP = true): number {

    const isNegative = xp < 0;

    let remainingXP = addMyXP ? Math.floor(xp + this.stats.xp) : xp;
    if(remainingXP > 0 && isNegative) remainingXP = -1;

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

  public spendGold(gold = 0, addMyGold = true): number {
    this.increaseStatistic('Character/Gold/Spend', gold);
    return this.gainGold(-gold, addMyGold);
  }

  public gainGold(gold = 0, addMyGold = true): number {

    const isNegative = gold < 0;

    let remainingGold = addMyGold ? Math.floor(gold + this.stats.gold) : gold;
    if(remainingGold > 0 && isNegative) remainingGold = -1;

    if(remainingGold < 0) {
      this.gold += remainingGold;
      this.increaseStatistic('Character/Gold/Lose', -remainingGold);
      this.gold = Math.max(0, this.gold);
      return remainingGold;
    }

    this.increaseStatistic('Character/Gold/Gain', remainingGold);

    if(this.guildName) {
      const guild = this.$$game.guildManager.getGuild(this.guildName);
      if(guild) {
        const taxRate = guild.taxes.gold || 0;
        if(taxRate > 0) {
          const donatedGold = Math.floor(remainingGold * (taxRate / 100));

          const existing = guild.resources.gold || 0;
          this.increaseStatistic(`Guild/Donate/Resource/Gold`, donatedGold);
          this.$$game.guildManager.updateGuildKey(this.guildName, `resources.gold`, existing + donatedGold);

          this.gold += remainingGold - donatedGold;

        } else {
          this.gold += remainingGold;
        }
      }
    } else {
      this.gold += remainingGold;
    }


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
    this.xp.maximum = this.$$game.calculatorHelper.calcLevelMaxXP(1);

    this.gainILP(this.level.maximum);

    this.increaseStatistic('Character/Ascension/Levels', this.level.maximum);
    this.level.maximum = this.level.maximum + (this.ascensionLevel * 10);

    this.increaseStatistic('Character/Ascension/Gold', this.gold);
    Object.values(this.$petsData.allPets).forEach((pet: IPet) => pet.gold.set(0));
    this.gold = 0;

    this.increaseStatistic('Character/Ascension/ItemScore', this.$inventory.totalItemScore());
    const items = this.$game.itemGenerator.generateNewbieItems();
    items.forEach(item => this.$inventory.equipItem(item));
    this.$inventory.clearInventory();
    this.$inventory.clearBuffScrolls();

    this.increaseStatistic('Character/Ascension/Collectibles', this.$collectibles.getFoundOwnedCollectibles().length);
    this.$collectibles.resetFoundAts();

    this.$choices.removeAllChoices();

    this.increaseStatistic('Character/Ascension/Times', 1);

    this.$pets.resetEquipment();

    this.buffWatches = { };

    this.$$game.festivalManager.startAscensionFestival(this);

    this.setPos(10, 10, 'Norkos', 'Norkos Town');

    this.calculateStamina();
    this.recalculateStats();
  }

  private checkStaminaTick() {
    if(this.stamina.atMaximum()) {
      this.nextStaminaTick = Date.now();
        if(this.$personalities.isActive('Restless')) {
        this.oocAction(2);
      return;
      }
    }

    if(this.stamina.atMaximum() || Date.now() < this.nextStaminaTick) return;

    this.increaseStatistic('Character/Stamina/Gain', 1);
    this.stamina.add(1);

    this.nextStaminaTick = this.nextStaminaTick + (STAMINA_TICK_BOOST * (this.$premiumData && this.$premiumData.tier ? 0.8 : 1));

    if(this.$personalities.isActive('Restless') && this.stamina.atMaximum() && Date.now() < this.nextStaminaTick) {
      this.oocAction(2);
    }

    if(Date.now() > this.nextStaminaTick) this.checkStaminaTick();
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

    // the permanent boosted upgrade value
    staminaTotal += this.$statistics.get('Game/Premium/Upgrade/MaxStaminaBoost');

    this.stamina.maximum = staminaTotal;

    if(this.stamina.total > this.stamina.maximum) this.stamina.set(this.stamina.maximum);
  }

  private tryLevelUp(): void {
    if(!this.xp.atMaximum()) return;
    this.level.add(1);

    this.gainILP(1);

    this.xp.toMinimum();
    this.resetMaxXP();

    this.increaseStatistic('Character/Experience/Levels', 1);
    this.calculateStamina();

    this.$$game.sendClientUpdateForPlayer(this);

    if(this.$personalities.isActive('Autoscender') && this.level.atMaximum()) {
      this.ascend();
    }
  }

  public resetMaxXP(): void {
    this.xp.maximum = this.$$game.calculatorHelper.calcLevelMaxXP(this.level.total);
  }

  private addStatTrail(stat: Stat, val: number, reason: string) {
    if(val === 0) return;

    val = Math.floor(val);
    if(isNaN(val) || !isFinite(val)) return;

    this.stats[stat] = this.stats[stat] || 0;
    this.stats[stat] += val;
    this.$statTrail[stat] = this.$statTrail[stat] || [];
    this.$statTrail[stat].push({ val, reason });
  }

  public recalculateStats(): void {
    if(!this.$inventoryData) return;

    this.stats = { };
    this.$statTrail = { };

    this.stats.specialName = this.$profession.specialStatName || '';

    // start salvage at 100 for calculation purposes
    this.stats[Stat.SALVAGE] = 100;

    let guildStats = { };
    if(this.guildName) {
      const guild = this.$$game.guildManager.getGuild(this.guildName);
      if(guild) {
        guildStats = guild.calculateStats();
      }
    }

    // dynamically-calculated
    // first, we do the addition-based adds
    const allStats = Object.keys(Stat).map(key => Stat[key]);
    allStats.forEach(stat => {

      this.stats[stat] = this.stats[stat] || 0;

      // stats per level boost
      const profBasePerLevel = this.$profession.calcLevelStat(this.level.total, stat);
      this.addStatTrail(stat, profBasePerLevel, `${this.profession}: Base / Lv. (${(profBasePerLevel / this.level.total).toFixed(1)})`);

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
          if(!buff.stats || !buff.stats[stat]) return;
          this.addStatTrail(stat, buff.stats[stat], `${buff.booster ? 'Booster' : 'Injury'}: ${buff.name}`);
        });
      });

      if(guildStats[stat]) {
        this.addStatTrail(stat, guildStats[stat], `Guild Garden`);
      }

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

      // festivals
      if(stat !== Stat.SPECIAL && !this.hardcore) {
        this.addStatTrail(stat, Math.floor(statBase * this.$$game.festivalManager.getMultiplier(stat)), 'Festivals');
      }
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

    this.addStatTrail(Stat.SALVAGE, this.$statistics.get('Game/Premium/Upgrade/SalvageBoost'), 'Salvage Boost');

    // lower salvage by 100 to compensate for the calculations
    this.stats[Stat.SALVAGE] = Math.max(0, this.stats[Stat.SALVAGE] - 100);

    // base values
    this.stats[Stat.HP] = Math.max(1, this.stats[Stat.HP]);
    this.stats[Stat.XP] = Math.max(1, this.stats[Stat.XP]);
    this.stats[Stat.GOLD] = Math.max(0, this.stats[Stat.GOLD]);
  }

  private initLinks() {
    this.$quests.init(this);
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
      if(!successful) {
        this.alwaysTryAddToInventory(oldItem);
      }
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
    if(this.$personalities.isActive('Salvager')) {
      this.salvageItem(item);
      return 0;
    }

    let value = item.score > 10 ? item.score : 10;

    if(this.$personalities.isActive('Forager')) {
      value = Math.floor(value / 2);
    }

    const modValue = this.gainGold(value);
    this.increaseStatistic('Item/Sell/Times', 1);
    this.increaseStatistic('Item/Sell/GoldGain', modValue);

    return modValue;
  }

  public salvageItem(item: Item): { wood: number, clay: number, stone: number, astralium: number } {

    const wood = item.woodValue(this);
    const clay = item.clayValue(this);
    const stone = item.stoneValue(this);
    const astralium = item.astraliumValue(this);

    const resources = { wood, clay, stone, astralium };

    this.increaseStatistic('Item/Salvage/Times', 1);
    this.increaseStatistic('Item/Salvage/WoodGain', wood);
    this.increaseStatistic('Item/Salvage/ClayGain', clay);
    this.increaseStatistic('Item/Salvage/StoneGain', stone);
    this.increaseStatistic('Item/Salvage/AstraliumGain', astralium);

    if(this.guildName && this.$personalities.isActive('SupporterOfTheCause')) {
      const guild = this.$$game.guildManager.getGuild(this.guildName);
      if(guild) {
        let guildMessage = `${this.name} has donated`;
        Object.keys(resources).forEach(resource => {
          if(!resources[resource]) return;

          const existing = guild.resources[resource] || 0;
          this.increaseStatistic(`Guild/Donate/Resource/${capitalize(resource)}`, resources[resource]);
          this.$$game.guildManager.updateGuildKey(this.guildName, `resources.${resource}`, existing + resources[resource]);
          guildMessage += ` ${resources[resource]} ${resource},`;
        });
        guildMessage = guildMessage.substring(0, guildMessage.length - 1);
        guildMessage += ' to the guild treasury.';
        this.$$game.discordManager.notifyGuildChannel(this.name, guild, `resources`, guildMessage);
      }
    } else {
      this.$inventory.addResources({ clay, wood, stone, astralium });
    }

    return { clay, wood, stone, astralium };
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
    if(isNaN(val) || !isFinite(val)) return;

    this.$statistics.increase(stat, val);

    this.checkAchievements(stat);
    this.checkBuffs(stat);
    this.checkQuests(stat, val);
  }

  private checkQuests(stat: string, val: number) {
    this.$quests.checkQuests(this, stat, val);
  }

  private checkAchievements(stat: string) {
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
      this.syncPremium();

      this.$pets.syncBuyablePets(this);
    }

  }

  private checkBuffs(stat: string) {
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
      this.$pets.$activePet.recalculateStats();
    }
  }

  public togglePersonality(pers: string): boolean {
    if(!this.$personalities.has(pers)) return false;

    this.$personalities.toggle(this.$game.personalityManager.get(pers));
    this.recalculateStats();

    return true;
  }

  public getDefaultChoice(choices: string[]): string {
    if(this.$personalities.isActive('Fancypants')) {
      if(includes(choices, 'Double')) return 'Double';
      if(includes(choices, 'Sell')) return 'Sell';
      if(includes(choices, 'Inventory')) return 'Inventory';
      if(choices.length === 2 && includes(choices, 'Yes') && includes(choices, 'No')) {
        return sample(['Yes', 'No']);
      }
    }
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

  public syncIL3(stats) {

    this.$statistics.set('Game/IdleLands2/Played', stats.Ancient ? 1 : 0);
    this.$statistics.set('Game/IdleLands3/Played', Object.keys(stats || { }).length > 0 ? 1 : 0);
    this.$statistics.set('Game/IdleLands3/Donator', stats.Donator ? 1 : 0);
    this.$statistics.set('Game/IdleLands3/Contributor', stats.Contributor ? 1 : 0);
    this.$statistics.set('Game/IdleLands3/Ascensions', stats.Ascensions || 0);
    this.$statistics.set('Game/IdleLands3/Wolfmaster', stats.Wolfmaster ? 1 : 0);
    this.$statistics.set('Game/IdleLands3/Spiritualist', stats.Spiritualist ? 1 : 0);
    this.$statistics.set('Game/IdleLands3/Anniversary', stats.Anniversary || 0);

    this.checkAchievements('Game/IdleLands2/Played');
    ['Played', 'Donator', 'Contributor', 'Ascensions', 'Wolfmaster', 'Spiritualist', 'Anniversary'].forEach(stat => {
      this.checkAchievements(`Game/IdleLands3/${stat}`);
    });
  }

  public syncPremium() {
    if(!this.$premiumData) return;

    const collabTier = this.$statistics.get('Game/Contributor/ContributorTier');
    this.$statistics.set('Game/Contributor/ContributorTier', collabTier);

    this.checkAchievements('Game/Contributor/ContributorTier');

    const tier = this.$premiumData.tier + collabTier;

    const allAchievementBoosts = this.$achievements.getPermanentUpgrades();

    const allBuffBoosts = { };

    Object.keys(this.buffWatches).forEach(buffKey => {
      this.buffWatches[buffKey].forEach((buff: IBuff) => {
        if(!buff.permanentStats) return;
        Object.keys(buff.permanentStats).forEach(permanent => {
          allBuffBoosts[permanent] = allBuffBoosts[permanent] || 0;
          allBuffBoosts[permanent] += buff.permanentStats[permanent];
        });
      });
    });

    this.$statistics.set('Game/Premium/Tier', tier);
    this.checkAchievements('Game/Premium/Tier');

    this.$statistics.set('Game/Premium/Upgrade/AdventureLogSize',
      25
    + (allBuffBoosts[PermanentUpgrade.AdventureLogSizeBoost] || 0)
    + (allAchievementBoosts[PermanentUpgrade.AdventureLogSizeBoost] || 0)
    + (tier * 25)
    + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.AdventureLogSizeBoost)
    + this.$premium.getUpgradeLevel(PermanentUpgrade.AdventureLogSizeBoost));

    this.$statistics.set('Game/Premium/Upgrade/InventorySize',
      10
    + (allBuffBoosts[PermanentUpgrade.InventorySizeBoost] || 0)
    + (allAchievementBoosts[PermanentUpgrade.InventorySizeBoost] || 0)
    + (tier * 10)
    + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.InventorySizeBoost)
    + this.$premium.getUpgradeLevel(PermanentUpgrade.InventorySizeBoost));

    this.$statistics.set('Game/Premium/Upgrade/BuffScrollDuration',
      0
    + (allBuffBoosts[PermanentUpgrade.BuffScrollDuration] || 0)
    + (allAchievementBoosts[PermanentUpgrade.BuffScrollDuration] || 0)
    + (tier)
    + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.BuffScrollDuration)
    + this.$premium.getUpgradeLevel(PermanentUpgrade.BuffScrollDuration));

    this.$statistics.set('Game/Premium/Upgrade/ChoiceLogSize',
      10
    + (allBuffBoosts[PermanentUpgrade.ChoiceLogSizeBoost] || 0)
    + (allAchievementBoosts[PermanentUpgrade.ChoiceLogSizeBoost] || 0)
    + (tier * 5)
    + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.ChoiceLogSizeBoost)
    + this.$premium.getUpgradeLevel(PermanentUpgrade.ChoiceLogSizeBoost));

    this.$statistics.set('Game/Premium/Upgrade/ItemStatCap',
      300
    + (allBuffBoosts[PermanentUpgrade.ItemStatCapBoost] || 0)
    + (allAchievementBoosts[PermanentUpgrade.ItemStatCapBoost] || 0)
    + (tier * 50)
    + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.ItemStatCapBoost)
    + this.$premium.getUpgradeLevel(PermanentUpgrade.ItemStatCapBoost) * 10);

    this.$statistics.set('Game/Premium/Upgrade/EnchantCap',
      10
    + (allBuffBoosts[PermanentUpgrade.EnchantCapBoost] || 0)
    + (allAchievementBoosts[PermanentUpgrade.EnchantCapBoost] || 0)
    + (tier)
    + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.EnchantCapBoost)
    + this.$premium.getUpgradeLevel(PermanentUpgrade.EnchantCapBoost));

    this.$statistics.set('Game/Premium/Upgrade/PetMissions',
      3
    + (allBuffBoosts[PermanentUpgrade.PetMissionCapBoost] || 0)
    + (allAchievementBoosts[PermanentUpgrade.PetMissionCapBoost] || 0)
    + (tier)
    + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.PetMissionCapBoost)
    + this.$premium.getUpgradeLevel(PermanentUpgrade.PetMissionCapBoost));

    this.$statistics.set('Game/Premium/Upgrade/MaxStaminaBoost',
      0
    + (allBuffBoosts[PermanentUpgrade.MaxStaminaBoost] || 0)
    + (allAchievementBoosts[PermanentUpgrade.MaxStaminaBoost] || 0)
    + (tier * 3)
    + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.MaxStaminaBoost)
    + this.$premium.getUpgradeLevel(PermanentUpgrade.MaxStaminaBoost) * 5);

    this.$statistics.set('Game/Premium/Upgrade/InjuryThreshold',
      3
      + (allBuffBoosts[PermanentUpgrade.InjuryThreshold] || 0)
      + (allAchievementBoosts[PermanentUpgrade.InjuryThreshold] || 0)
    );

    this.$statistics.set('Game/Premium/Upgrade/MaxPetsInCombat',
      1
      + (allBuffBoosts[PermanentUpgrade.MaxPetsInCombat] || 0)
      + (allAchievementBoosts[PermanentUpgrade.MaxPetsInCombat] || 0)
    );

    this.$statistics.set('Game/Premium/Upgrade/MaxQuests',
      1
      + tier
      + (allAchievementBoosts[PermanentUpgrade.MaxQuestsCapBoost] || 0)
      + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.MaxQuestsCapBoost)
    );

    this.$statistics.set('Game/Premium/Upgrade/SalvageBoost',
      0
      + (allBuffBoosts[PermanentUpgrade.SalvageBoost] || 0)
      + (allAchievementBoosts[PermanentUpgrade.SalvageBoost] || 0)
      + this.$pets.getTotalPermanentUpgradeValue(PermanentUpgrade.SalvageBoost)
    );

    this.$pets.validatePetMissionsAndQuantity(this);
    this.$choices.updateSize(this);
    this.$inventory.updateSize(this);
    this.$quests.updateQuestsBasedOnTotals(this);
  }

  public gainILP(ilp: number): void {
    this.increaseStatistic('Game/Premium/ILP/LifetimeGain', ilp);
    this.$premium.gainILP(ilp);
  }

  public changeProfessionWithRef(prof: string): void {
    this.changeProfession(this.$game.professionHelper.getProfession(prof));
  }

  public changeProfession(prof: BaseProfession): void {
    if(prof.constructor.name !== this.profession) {
      this.removeBuffByName('Bone Minions');
      this.removeBuffByName('Pheromone');
    }

    this.profession = <Profession>prof.constructor.name;
    this.$profession = prof;
    this.$professionData = prof.$professionData;
    this.recalculateStats();

    this.$$game.sendClientUpdateForPlayer(this);
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
    currentCollectible.rarity = rarity;
    currentCollectible.description = description;
    currentCollectible.storyline = storyline;
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
    if(!buff.statistic) return;

    this.increaseStatistic(`Character/${buff.booster ? 'Booster' : 'Injury'}/Receive`, 1);

    this.buffWatches[buff.statistic] = this.buffWatches[buff.statistic] || [];
    this.buffWatches[buff.statistic].unshift(buff);
    this.buffWatches[buff.statistic] = uniqBy(this.buffWatches[buff.statistic], (checkBuff: IBuff) => checkBuff.name);

    this.syncPremium();
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
    const canDo = Object.values(this.$choices.$choicesData.choices).length === 0 && this.$statistics.get('Character/Choose/Total') === 0;
    if(!canDo) return;

    this.$game.doStartingPlayerStuff(this);
  }

  private getAllInjuries(): IBuff[] {
    const allInjuries = [];

    Object.values(this.buffWatches).forEach(buffList => {
      allInjuries.push(...buffList.filter(x => !x.booster));
    });

    return allInjuries;
  }

  public injuryCount(): number {
    return this.getAllInjuries().length;
  }

  public giveCure() {
    this.$$game.buffManager.cureInjury(this);
    this.cureInjury();
  }

  public removeBuffByName(name: string) {
    Object.keys(this.buffWatches).forEach(buffKey => {
      this.buffWatches[buffKey] = this.buffWatches[buffKey].filter((buff: IBuff) => {
        return buff.name !== name;
      });
    });
  }

  public cureInjury() {
    let hasCured = false;

    Object.keys(this.buffWatches).forEach(buffKey => {
      if(hasCured) return;

      this.buffWatches[buffKey] = this.buffWatches[buffKey].filter(buff => {
        if(hasCured || buff.booster) return true;

        hasCured = true;
        return false;
      });
    });

    if(hasCured) {
      this.increaseStatistic(`Character/Injury/Cure`, 1);
      this.recalculateStats();
    }
  }

  public setDiscordTag(discordTag: string) {
    if(!discordTag) {
      this.$$game.discordManager.removeAllRoles(this);
      this.discordTag = '';
      this.$statistics.set('Game/Contributor/ContributorTier', ContributorTier.None);
      this.$premium.setTier(PremiumTier.None);
      return;
    }

    this.discordTag = discordTag;

    let newPremium = PremiumTier.None;
    if(this.$$game.discordManager.hasRole(discordTag, 'Patron')) newPremium = PremiumTier.Subscriber;
    if(this.$$game.discordManager.hasRole(discordTag, 'Patron Saint')) newPremium = PremiumTier.Subscriber2;

    if(this.$$game.discordManager.hasRole(discordTag, 'Collaborator')) {
      this.$statistics.set('Game/Contributor/ContributorTier', ContributorTier.Contributor);
    }

    this.$$game.discordManager.checkUserRoles(this);

    this.$premium.setTier(newPremium);
  }

  public killHardcore(): void {
    this.dead = true;
    this.$statistics.set(`Hardcore/Dead`, 1);
    this.$$game.chatHelper.sendMessageFromClient({
      message: `Hardcore player ${this.name} has passed on.`,
      playerName: '☆System'
    });
  }

  public reviveHardcore(): void {
    if(!this.$statistics.get('Hardcore/Dead')) return;

    this.lastAscension = null;
    this.ascensionLevel = 0;

    this.level.minimum = 1;
    this.level.set(1);

    this.xp.set(0);
    this.xp.maximum = this.$$game.calculatorHelper.calcLevelMaxXP(1);

    const counts = {
      Ascensions: this.$statistics.get('Character/Ascension/Times'),
      Levels: this.$statistics.get('Character/Experience/Levels'),
      Ticks: this.$statistics.get('Character/Ticks'),
      Steps: this.$statistics.get('Character/Movement/Steps/Normal'),
      Gold: this.gold
    };

    Object.keys(counts).forEach((stat) => {
      const value = counts[stat];
      this.increaseStatistic(`Hardcore/Total/${stat}`, value);
      if(value > this.$statistics.get(`Hardcore/Best/${stat}`)) this.$statistics.set(`Hardcore/Best/${stat}`, value);
    });

    this.increaseStatistic('Hardcore/Total/Deaths', 1);

    this.level.maximum = 100;

    this.gold = 0;

    // Remove all pets

    const items = this.$game.itemGenerator.generateNewbieHardcoreItems();
    items.forEach(item => this.$inventory.equipItem(item));
    this.$inventory.clearInventory();
    this.$inventory.clearBuffScrolls();

    // Remove all collectibles

    this.increaseStatistic('Character/Ascension/Collectibles', this.$collectibles.getFoundOwnedCollectibles().length);
    this.$collectibles.resetFoundAts();

    this.$choices.removeAllChoices();

    this.buffWatches = { };

    this.$$game.chatHelper.sendMessageFromClient({
      message: `Hardcore player ${this.name} has risen anew.  Wish them luck.`,
      playerName: '☆System'
    });

    this.setPos(10, 10, 'Norkos', 'Norkos Town');

    this.calculateStamina();
    this.recalculateStats();
  }
}
