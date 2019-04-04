
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { IPersonality } from '../../interfaces';

@Entity()
export class Personalities extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private personalities: IPersonality[];

  public get $personalitiesData() {
    return { personalities: this.personalities };
  }

  constructor() {
    super();
    if(!this.personalities) this.personalities = [];
  }

}
