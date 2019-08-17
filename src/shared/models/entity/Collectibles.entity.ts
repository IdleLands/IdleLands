
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

  public add(coll: ICollectible): void {
    this.collectibles[coll.name] = coll;
  }

  public has(collName: string): boolean {
    return !!this.get(collName);
  }

  public hasCurrently(collName: string): boolean {
    const coll = this.get(collName);
    if(!coll) return false;

    return coll.foundAt !== 0;
  }

  public get(collName: string): ICollectible {
    return this.collectibles[collName];
  }

  public resetFoundAts() {
    Object.keys(this.collectibles).forEach(collName => {
      const coll = this.get(collName);
      coll.foundAt = 0;
    });
  }

  public getFoundCollectibles(): number {
    return Object.keys(this.collectibles).length;
  }

  public getUnfoundOwnedCollectibles() {
    return Object.values(this.collectibles).filter(coll => coll.foundAt === 0);
  }

  public getFoundOwnedCollectibles() {
    return Object.values(this.collectibles).filter(coll => coll.foundAt !== 0);
  }

  public refindCollectible(collectible: string) {
    if(!this.collectibles[collectible]) return;
    this.collectibles[collectible].foundAt = Date.now();
  }

}
