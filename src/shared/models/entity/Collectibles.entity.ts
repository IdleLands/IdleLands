
import { Entity, Column, ObjectIdColumn } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { ICollectible } from '../../interfaces';

@Entity()
export class Collectibles extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private collectibles: { [key: string]: ICollectible };

  public get $collectiblesData() {
    return { collectibles: this.collectibles };
  }

  constructor() {
    super();
    if(!this.collectibles) this.collectibles = {};
  }

  // TODO: if coll.achievedAt < player.ascension (or no coll, or no asc) add it and increment count by 1
  // TODO: increment "collectibles touched" stat (every time you step into one, whether you collect it or not)
  public add(coll: ICollectible): void {
    this.collectibles[coll.name] = coll;
  }

  public has(collName: string): boolean {
    return !!this.collectibles[collName];
  }

}
