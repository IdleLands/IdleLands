
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { sample, pickBy } from 'lodash';
import { RestrictedNumber } from 'restricted-number';
import { nonenumerable } from 'nonenumerable';

import { IPlayer } from '../../interfaces/IPlayer';
import { Statistics } from './Statistics';

import { Profession } from '../../professions/Profession';
import * as AllProfessions from '../../professions';

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

  // joined vars
  // not serialized to the client
  @nonenumerable
  public $statistics: Statistics;

  @nonenumerable
  public $profession: Profession;

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
  }

  toSaveObject(): any {
    return pickBy(this, (value, key) => !key.startsWith('$'));
  }

  async loop() {
    this.xp.add(1);
    console.log('loop', Date.now(), this.name);
  }
}
