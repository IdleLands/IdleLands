import { Player } from './Player';
import { Column } from 'typeorm';

export class PlayerOwned {

  @Column()
  public owner: string;

  setOwner(owner: Player) {
    this.owner = owner.name;
  }
}
