
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { sample, pickBy, clone, includes } from 'lodash';
import { RestrictedNumber } from 'restricted-number';
import { nonenumerable } from 'nonenumerable';

import { Statistics } from './Statistics.entity';
import { Inventory } from './Inventory.entity';
import { Choices } from './Choices.entity';

import { Profession } from '../../professions/Profession';
import * as AllProfessions from '../../professions';
import { Item } from '../Item';
import { IGame, Stat, IPlayer, ItemSlot, ServerEventName,
  IAdventureLog, AdventureLogEventType, AchievementRewardType } from '../../interfaces';
import { SHARED_FIELDS } from '../../../server/core/game/shared-fields';
import { Choice } from '../Choice';
import { Achievements } from './Achievements.entity';
import { Channel } from '../../../server/core/game/subscription-manager';
import { Personalities } from './Personalities.entity';

// 5 minutes on prod, 5 seconds on dev
const STAMINA_TICK_BOOST = process.env.NODE_ENV === 'production' ? 300000 : 5000;

/**
 * Note: some attributes are @nonenumerable, while others are prefixed with $.
 * @nonenumerable attributes are not sending updates to the client, and they also do not get sent to the DB.
 * $ attributes are not saved to the DB, but are sent to the client unless marked with @nonenumerable.
 *
 * To save a @nonenumerable attr to the DB, DatabaseManager#savePlayer must be updated to manually copy these fields.
 * $ attributes should never be saved to the DB, and are prefixed as such because it directly conflicts with MongoDB.
 */

@Entity()
export class Player implements IPlayer {

  // internal vars
  @nonenumerable
  @ObjectIdColumn() public _id: string;

  @nonenumerable
  private $game: IGame;

  @Index({ unique: true })
  @Column() public userId: string;
  @Column() public currentUserId: string;

  @Index({ unique: true })
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
  @Column() public x: number;
  @Column() public y: number;
  @Column() public gold: number;
  @Column() public eventSteps: number;

  @Column() public stamina: RestrictedNumber;
  @Column() public nextStaminaTick: number;

  // non-saved player vars
  // still serialized to the client
  public sessionId: string;

  private stats: any = {};
  public $statTrail: any = {};

  // joined vars
  // not serialized to the client
  @nonenumerable
  public $profession: Profession;
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

  @Column()
  public availableGenders: string[];

  @Column()
  public availableTitles: string[];

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
    if(!this.gold) this.gold = 0;
    if(!this.stamina) this.stamina = new RestrictedNumber(0, 10, 10);
    if(!this.nextStaminaTick) this.nextStaminaTick = Date.now();

    if(!this.$profession) {
      this.$profession = new AllProfessions[this.profession]();
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
    SHARED_FIELDS.forEach(({ name }) => {
      this[`$${name}Data`] = this[`$${name}`][`$${name}Data`];
    });

    this.increaseStatistic('Game.Logins', 1);

    this.recalculateStats();

    this.syncPremium();
  }

  public toSaveObject(): any {
    return pickBy(this, (value, key) => !key.startsWith('$'));
  }

  public fullName(): string {
    if(this.title) return `${this.name}, the ${this.title}`;
    return this.name;
  }

  async loop(): Promise<void> {

    this.increaseStatistic('Character.Ticks', 1);

    this.gainXP(0);
    this.gainGold(0);
    this.checkStaminaTick();
    this.$game.eventManager.tryToDoEventFor(this);
  }

  public getStat(stat: Stat): number {
    return this.stats[stat];
  }

  public oocAction(): string {
    if(this.stamina.total < this.$profession.oocAbilityCost) return;

    this.increaseStatistic('Character.Stamina.Spend', this.$profession.oocAbilityCost);
    this.increaseStatistic(`Profession.${this.profession}.AbilityUses`, this.$profession.oocAbilityCost);

    this.stamina.sub(this.$profession.oocAbilityCost);
    return this.$profession.oocAbility(this);
  }

  public canLevelUp(): boolean {
    return !this.level.atMaximum();
  }

  public gainXP(xp = 0): number {

    let remainingXP = Math.floor(xp + this.stats.xp);
    const totalXP = remainingXP;

    if(remainingXP < 0) {
      this.xp.add(remainingXP);
      this.increaseStatistic('Character.Experience.Lose', -remainingXP);
      return remainingXP;
    }

    // always gain profession xp, even if you are level blocked
    this.increaseStatistic(`Profession.${this.profession}.Experience`, remainingXP);

    while(remainingXP > 0 && this.canLevelUp()) {
      this.increaseStatistic('Character.Experience.Gain', remainingXP);
      const preAddXP = this.xp.total;
      this.xp.add(remainingXP);

      const xpDiff = this.xp.total - preAddXP;
      remainingXP -= xpDiff;

      this.tryLevelUp();
    }

    return totalXP;
  }

  public spendGold(gold = 0): number {
    this.increaseStatistic('Character.Gold.Spend', gold);
    return this.gainGold(-gold);
  }

  public gainGold(gold = 0): number {

    const remainingGold = Math.floor(gold + this.stats.gold);

    if(remainingGold < 0) {
      this.gold += remainingGold;
      this.increaseStatistic('Character.Gold.Lose', -remainingGold);
      this.gold = Math.max(0, this.gold);
      return remainingGold;
    }

    this.increaseStatistic('Character.Gold.Gain', remainingGold);
    this.gold += remainingGold;

    return remainingGold;
  }

  public ascend(): void {
    if(this.canLevelUp()) return;

    this.lastAscension = Date.now();
    this.ascensionLevel = this.ascensionLevel || 0;
    this.ascensionLevel++;
    this.xp.toMinimum();
    this.level.toMinimum();

    this.increaseStatistic('Character.Ascension.Levels', this.level.maximum);
    this.level.maximum = this.level.maximum + (this.ascensionLevel * 10);

    this.increaseStatistic('Character.Ascension.Times', 1);
  }

  private checkStaminaTick() {
    if(this.stamina.atMaximum() || Date.now() < this.nextStaminaTick) return;

    this.increaseStatistic('Character.Stamina.Gain', 1);
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

    this.xp.toMinimum();
    this.xp.maximum = this.calcLevelMaxXP(this.level.total);

    this.increaseStatistic('Character.Experience.Levels', 1);
    this.calculateStamina();
  }

  private addStatTrail(stat: Stat, val: number, reason: string) {
    if(val === 0) return;

    this.stats[stat] = this.stats[stat] || 0;
    this.stats[stat] += val;
    this.$statTrail[stat] = this.$statTrail[stat] || [];
    this.$statTrail[stat].push({ val, reason });
  }

  public recalculateStats(): void {
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

    this.$choices.init(this);

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

    this.increaseStatistic('Item.Equip.Times', 1);

    this.$inventory.equipItem(item);
    this.recalculateStats();
    return true;
  }

  public unequip(item: Item, failOnInventoryFull = false): boolean {
    if(failOnInventoryFull && !this.$inventory.canAddItemsToInventory()) return false;

    this.$inventory.unequipItem(item);
    this.recalculateStats();

    this.increaseStatistic('Item.Unequip.Times', 1);

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
    this.increaseStatistic('Item.Sell.Times', 1);
    this.increaseStatistic('Item.Sell.GoldGain', modValue);

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

        this.$game.subscriptionManager.emitToChannel(Channel.EventMessage, { playerNames: [this.name], data: messageData });
      });

      this.syncTitles();
      this.syncGenders();
      this.syncPersonalities();
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

  // TODO: add this to a premium object (tiers: donator, subscriber, moderator, contributor, gm)
  private syncPremium() {
    const tier = 0;

    this.$statistics.set('Game.Premium.Tier', tier);
    this.$statistics.set('Game.Premium.AdventureLogSize', 25 + (tier * 25));
    this.$statistics.set('Game.Premium.InventorySize', 10 + (tier * 10));
    this.$statistics.set('Game.Premium.ChoiceLogSize', 10 + (tier * 10));
    this.$statistics.set('Game.Premium.ItemStatCap', 3 + (tier));
    this.$statistics.set('Game.Premium.EnchantCap', 10 + (tier));
  }
}