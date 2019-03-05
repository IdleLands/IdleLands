
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { IPlayer } from '../../interfaces/IPlayer';

@Entity()
export class Player implements IPlayer {

  @ObjectIdColumn()
  private id: number;

  @Column()
  @Index({ unique: true })
  private userId: string;

  @Column()
  @Index({ unique: true })
  private authId: string;

  @Column()
  public readonly createdAt: number;

  @Column()
  @Index({ unique: true })
  public readonly name: string;

  @Column()
  public readonly level: number;

  @Column()
  public readonly profession: string;

  @Column()
  public readonly map: string;

  constructor() {
    if(!this.createdAt) this.createdAt = Date.now();
    if(!this.level) this.level = 1;
    if(!this.profession) this.profession = 'Merchant';
    if(!this.map) this.map = 'Norkos';
  }
}
