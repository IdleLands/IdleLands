import { Column } from 'typeorm';
import { pickBy } from 'lodash';

import { Player } from './Player';

export class PlayerOwned {

  @Column()
  public owner: string;

  setOwner(owner: Player) {
    this.owner = owner.name;
  }

  toSaveObject() {
    return pickBy(this, (value, key) => !key.startsWith('$'));
  }
}
