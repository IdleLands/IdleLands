import { Player } from './Player';

export class PlayerOwned {
  public owner: string;

  setOwner(owner: Player) {
    this.owner = owner.name;
  }
}
