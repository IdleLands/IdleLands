
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { sample, pickBy } from 'lodash';
import { RestrictedNumber } from 'restricted-number';
import { nonenumerable } from 'nonenumerable';

import { IPlayer } from '../../interfaces/IPlayer';
import { Statistics } from './Statistics';

import { Profession } from '../../professions/Profession';
import * as AllProfessions from '../../professions';
import { Stat } from '../../interfaces/Stat';

@Entity()
export class Player implements IPlayer {

  // internal vars
  @nonenumerable
  @ObjectIdColumn() public _id: string;

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

    // reset some aspects
    this.level = new RestrictedNumber(this.level.minimum, this.level.maximum, this.level.__current);
    this.xp = new RestrictedNumber(this.xp.minimum, this.xp.maximum, this.xp.__current);

    this.recalculateStats();
  }

  toSaveObject(): any {
    return pickBy(this, (value, key) => !key.startsWith('$'));
  }

  async loop(): Promise<void> {
    this.gainXP(1);
  }

  public canLevelUp(): boolean {
    return !this.level.atMaximum();
  }

  public gainXP(xp: number): void {

    let remainingXP = xp;

    if(remainingXP < 0) {
      this.xp.add(remainingXP);
      this.$statistics.increase('Character.Experience.Lose', -remainingXP);
      return;
    }

    // TODO: track stats and edit 'xp' here.

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

    this.stats[stat] += val;
    this.$statTrail[stat] = this.$statTrail[stat] || [];
    this.$statTrail[stat].push({ val, reason });
  }

  public recalculateStats(): void {
    this.stats = {};
    this.$statTrail = {};

    Object.keys(Stat).map(key => Stat[key]).forEach(stat => {
      this.stats[stat] = 0;

      const profBasePerLevel = this.$profession.calcLevelStat(this, stat);
      this.addStatTrail(stat, profBasePerLevel, `${this.profession} Base Per Level (${profBasePerLevel})`);

      const profMult = this.$profession.calcStatMultiplier(stat);
      if(profMult > 1) {
        const addedValue = Math.floor((this.stats[stat] * profMult)) - this.stats[stat];
        this.addStatTrail(stat, addedValue, `${this.profession} Multiplier (${profMult.toFixed(1)}x)`);
      } else if(profMult < 1) {
        const lostValue = Math.floor(this.stats[stat] * profMult);
        this.addStatTrail(stat, -lostValue, `${this.profession} Multiplier (${profMult.toFixed(1)}x)`);
      }
    });
  }
}
