
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { Item } from './Item';
import { ItemSlot } from '../../interfaces';
import { Player } from './Player';

@Entity()
export class Inventory extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private equipment: { [key in ItemSlot]?: Item };

  @Column()
  private items: Item[];

  public get inventoryData() {
    return { equipment: this.equipment, items: this.items };
  }

  constructor() {
    super();
    if(!this.equipment) this.equipment = {};
    if(!this.items) this.items = [];
  }

  public isNeedingNewbieItems(): boolean {
    return Object.keys(this.equipment).length === 0;
  }

  public itemInEquipmentSlot(slot: ItemSlot): Item {
    return this.equipment[slot];
  }

  public canAddItemsToInventory(player: Player) {
    return this.items.length < 10;
  }

  public addItemToInventory(player: Player, item: Item) {
    if(!this.canAddItemsToInventory(player)) return;

    this.items = this.items || [];
    this.items.push(item);
  }

  public equipItem(player: Player, item: Item) {
    this.equipment = this.equipment || {};
    this.equipment[item.type] = item;
  }

}
