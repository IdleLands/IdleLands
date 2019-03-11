
import { Entity, ObjectIdColumn } from 'typeorm';
import { nonenumerable } from 'nonenumerable';

import { IItem } from '../../interfaces/IItem';

@Entity()
export class Item implements IItem {

  // internal vars
  @nonenumerable
  @ObjectIdColumn() public _id: string;
}
