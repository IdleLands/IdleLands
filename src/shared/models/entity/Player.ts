
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { sample, pickBy } from 'lodash';

import { IPlayer } from '../../interfaces/IPlayer';
import { Statistics } from './Statistics';

@Entity()
export class Player implements IPlayer {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Index({ unique: true })
  @Column() public userId: string;

  @Column() public authType: string;

  @Index({ unique: true })
  @Column() public authId: string;

  @Column() public createdAt: number;
  @Column() public loggedIn: boolean;

  public sessionId: string;

  // joined vars
  public $statistics: Statistics;

  // player-related vars
  @Index({ unique: true })
  @Column() public name: string;

  @Column() public level: number;
  @Column() public profession: string;
  @Column() public gender: string;
  @Column() public map: string;
  @Column() public x: number;
  @Column() public y: number;

  init() {
    if(!this.createdAt) this.createdAt = Date.now();
    if(!this.level) this.level = 1;
    if(!this.profession) this.profession = 'Merchant';
    if(!this.gender) this.gender = sample(['male', 'female', 'not a bear', 'glowcloud', 'astronomical entity', 'soap']);
    if(!this.map) this.map = 'Norkos';
    if(!this.x) this.x = 10;
    if(!this.y) this.y = 10;

    if(!this.$statistics) {
      this.$statistics = new Statistics();
      this.$statistics.setOwner(this);
    }
  }

  toSaveObject(): any {
    return pickBy(this, (value, key) => !key.startsWith('$'));
  }

  loop() {
    console.log('loop', Date.now(), this.name);
  }
}
