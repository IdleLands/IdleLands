
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { find, pull } from 'lodash';

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

  @Column()
  private size: number;

  public get $inventoryData() {
    return { equipment: this.equipment, items: this.items, size: this.size };
  }

  constructor() {
    super();
    if(!this.equipment) this.equipment = {};
    if(!this.items) this.items = [];
  }

  // basic functions
  private calcSize(player: Player): number {
    return 10;
  }

  public init(player: Player): void {
    this.size = this.calcSize(player);
  }

  public isNeedingNewbieItems(): boolean {
    return Object.keys(this.equipment).length === 0;
  }

  // equipment-related functions
  public itemInEquipmentSlot(slot: ItemSlot): Item {
    return this.equipment[slot];
  }

  public equipItem(item: Item): void {
    this.equipment = this.equipment || {};
    this.equipment[item.type] = item;
  }

  public unequipItem(item: Item): void {
    const itemExisting = this.itemInEquipmentSlot(item.type);
    if(item !== itemExisting) throw new Error(`Could not unequip ${item.name} since it is not equipped.`);

    this.equipment[item.type] = null;
  }

  // inventory-related functions
  public canAddItemsToInventory(): boolean {
    return this.items.length < this.size;
  }

  public addItemToInventory(item: Item): void {
    if(!this.canAddItemsToInventory()) return;

    this.items = this.items || [];
    this.items.push(item);
  }

  public removeItemFromInventory(item: Item): void {
    pull(this.items, item);
  }

  public getItemFromInventory(itemId: string): Item {
    return find(this.items, { id: itemId });
  }

}
