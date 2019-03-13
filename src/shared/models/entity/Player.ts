
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { sample, pickBy, clone } from 'lodash';
import { RestrictedNumber } from 'restricted-number';
import { nonenumerable } from 'nonenumerable';

import { Statistics } from './Statistics';

import { Profession } from '../../professions/Profession';
import * as AllProfessions from '../../professions';
import { Inventory } from './Inventory';
import { Item } from './Item';
import { IGame, Stat, IPlayer, ItemSlot } from '../../interfaces';

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

  // non-saved player vars
  // still serialized to the client
  public sessionId: string;

  public stats: any = {};

  // joined vars
  // not serialized to the client
  @nonenumerable
  public $statistics: Statistics;
  public $statisticsData: any;

  @nonenumerable
  public $inventory: Inventory;
  public $inventoryData: any;

  @nonenumerable
  public $profession: Profession;

  public $statTrail: any = {};

  @Column()
  public availableGenders: string[];

  @Column()
  public availableTitles: string[];

  init() {
    // validate that important properties exist
    if(!this.createdAt) this.createdAt = Date.now();
    if(!this.availableGenders) this.availableGenders = ['male', 'female', 'not a bear', 'glowcloud', 'astronomical entity', 'soap'];
    if(!this.availableTitles) this.availableTitles = ['Newbie'];
    if(!this.level) this.level = new RestrictedNumber(1, 100, 1);
    if(!this.xp) this.xp = new RestrictedNumber(0, 100, 0);
    if(!this.profession) this.profession = 'Generalist';
    if(!this.gender) this.gender = sample(this.availableGenders);
    if(!this.map) this.map = 'Norkos';
    if(!this.x) this.x = 10;
    if(!this.y) this.y = 10;

    if(!this.$profession) {
      this.$profession = new AllProfessions[this.profession]();
    }

    if(!this.$statistics) {
      this.$statistics = new Statistics();
      this.$statistics.setOwner(this);
    }

    if(!this.$inventory) {
      this.$inventory = new Inventory();
      this.$inventory.setOwner(this);
    }

    // reset some aspects
    this.level = new RestrictedNumber(this.level.minimum, this.level.maximum, this.level.__current);
    this.xp = new RestrictedNumber(this.xp.minimum, this.xp.maximum, this.xp.__current);

    // init extra data for relevant joined services
    this.initInventory();

    this.$statisticsData = this.$statistics.statisticsData;
    this.$statistics.increase('Game.Logins', 1);

    this.$inventoryData = this.$inventory.inventoryData;

    this.recalculateStats();
  }

  public toSaveObject(): any {
    return pickBy(this, (value, key) => !key.startsWith('$'));
  }

  async loop(): Promise<void> {
    this.gainXP(0);
  }

  public canLevelUp(): boolean {
    return !this.level.atMaximum();
  }

  public gainXP(xp = 0): void {

    let remainingXP = xp + this.stats.xp;

    if(remainingXP < 0) {
      this.xp.add(remainingXP);
      this.$statistics.increase('Character.Experience.Lose', -remainingXP);
      return;
    }

    while(remainingXP > 0 && this.canLevelUp()) {
      this.$statistics.increase('Character.Experience.Gain', remainingXP);
      const preAddXP = this.xp.total;
      this.xp.add(remainingXP);

      const xpDiff = this.xp.total - preAddXP;
      remainingXP -= xpDiff;

      this.tryLevelUp();
    }
  }

  public ascend(): void {
    if(this.canLevelUp()) return;

    this.lastAscension = Date.now();
    this.ascensionLevel = this.ascensionLevel || 0;
    this.ascensionLevel++;
    this.xp.toMinimum();
    this.level.toMinimum();

    this.$statistics.increase('Character.Ascension.Levels', this.level.maximum);
    this.level.maximum = this.level.maximum + (this.ascensionLevel * 10);

    this.$statistics.increase('Character.Ascension.Times', 1);
  }

  private calcLevelMaxXP(level: number): number {
    return Math.floor(100 + (100 * Math.pow(level, 1.71)));
  }

  private tryLevelUp(): void {
    if(!this.xp.atMaximum()) return;
    this.level.add(1);

    this.xp.toMinimum();
    this.xp.maximum = this.calcLevelMaxXP(this.level.total);

    this.$statistics.increase('Character.Experience.Levels', 1);
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

    // pre-configured
    this.addStatTrail(Stat.XP, 5, `Base`);

    // dynamically-calculated
    // first, we do the addition-based adds
    const allStats = Object.keys(Stat).map(key => Stat[key]);
    allStats.forEach(stat => {

      this.stats[stat] = this.stats[stat] || 0;

      Object.keys(this.$inventoryData.equipment).forEach(itemSlot => {
        const item = this.$inventory.itemInEquipmentSlot(<ItemSlot>itemSlot);
        if(!item || !item.stats[stat]) return;

        this.addStatTrail(stat, item.stats[stat], item.name);
      });

      // stats per level boost
      const profBasePerLevel = this.$profession.calcLevelStat(this, stat);
      this.addStatTrail(stat, profBasePerLevel, `${this.profession} Base / Lv. (${profBasePerLevel / this.level.total})`);


      // make sure it is 0. no super negatives.
      this.stats[stat] = Math.max(0, this.stats[stat]);
    });

    // here we do the multiplicative adds
    allStats.forEach(stat => {
      // stat profession multiplier boost
      const profMult = this.$profession.calcStatMultiplier(stat);
      if(profMult > 1) {
        const addedValue = Math.floor((this.stats[stat] * profMult)) - this.stats[stat];
        this.addStatTrail(stat, addedValue, `${this.profession} Mult. (${profMult.toFixed(1)}x)`);
      } else if(profMult < 1) {
        const lostValue = this.stats[stat] - Math.floor(this.stats[stat] * profMult);
        this.addStatTrail(stat, -lostValue, `${this.profession} Mult. (${profMult.toFixed(1)}x)`);
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

    // base values
    this.stats.hp = Math.max(1, this.stats.hp);
    this.stats.xp = Math.max(1, this.stats.xp);
    this.stats.gold = Math.max(1, this.stats.gold);
  }

  private initInventory() {
    if(this.$inventory.isNeedingNewbieItems()) {
      const items = this.$game.itemGenerator.generateNewbieItems();
      items.forEach(item => this.equip(item));
    }
  }

  public equip(item: Item) {
    const oldItem = this.$inventory.itemInEquipmentSlot(item.type);
    if(oldItem) {
      this.unequip(oldItem);
    }

    this.$inventory.equipItem(this, item);
  }

  // TODO: if there is space in the inventory, add the item to inventory, otherwise sell it
  // TODO: add selling functionality
  // TODO: track gold on player
  public unequip(item: Item) {
    if(this.$inventory.canAddItemsToInventory(this)) {
      this.$inventory.addItemToInventory(this, item);
    } else {
      // TODO: sell the item
    }
  }
}
