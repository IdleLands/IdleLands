
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { Player } from './Player.entity';

@Entity()
export class Pets extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private allPets: { [key: string]: string };

  @Column()
  private currentPet: { [key: string]: boolean };

  public get $petsData() {
    return { currentPet: this.currentPet, allPets: this.allPets };
  }

  constructor() {
    super();
    if(!this.allPets) this.allPets = {};
    if(!this.currentPet) this.currentPet = {};
  }

  public init(player: Player) {
    console.log('init pets');

    // if no current pet, create one and add it to the list based on a proto
    // need to be able to get pet protos from the DB (?) - probably the asset handler or some such
  }

}
