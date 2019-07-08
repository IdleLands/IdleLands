import { Column, ObjectIdColumn } from 'typeorm';
import { ObjectID } from 'mongodb';

import { pickBy } from 'lodash';

import { Player } from './Player.entity';

export class PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: ObjectID;

  @Column()
  public owner: string;

  setOwner(owner: Player) {
    this.owner = this.owner || owner.name;
    this._id = this._id || ObjectID();
  }

  toSaveObject(): any {
    return pickBy(this, (value, key) => !key.startsWith('$'));
  }
}
