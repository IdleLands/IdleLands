
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { sample } from 'lodash';

import { IPlayer } from '../../interfaces/IPlayer';

@Entity()
export class Player implements IPlayer {

  // internal vars
  @ObjectIdColumn()
  private id: number;

  @Column()
  @Index({ unique: true })
  private userId: string;

  @Column()
  @Index({ unique: true })
  private authId: string;

  @Column()
  public createdAt: number;

  @Column()
  public loggedIn: boolean;

  // player-related vars
  @Column()
  @Index({ unique: true })
  public name: string;

  @Column()
  public level: number;

  @Column()
  public profession: string;

  @Column()
  public gender: string;

  @Column()
  public map: string;

  @Column()
  public x: number;

  @Column()
  public y: number;

  init() {
    if(!this.createdAt) this.createdAt = Date.now();
    if(!this.level) this.level = 1;
    if(!this.profession) this.profession = 'Merchant';
    if(!this.gender) this.gender = sample(['male', 'female', 'not a bear', 'glowcloud', 'astronomical entity', 'soap']);
    if(!this.map) this.map = 'Norkos';
    if(!this.x) this.x = 10;
    if(!this.y) this.y = 10;
  }

  loop() {
    console.log('loop', this.name);
  }
}
