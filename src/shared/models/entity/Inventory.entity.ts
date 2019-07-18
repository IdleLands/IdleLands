
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { find, pull, sumBy } from 'lodash';

import { PlayerOwned } from './PlayerOwned';
import { Item } from '../Item';
import { ItemSlot, TeleportItemLocation } from '../../interfaces';
import { Player } from './Player.entity';

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

  @Column()
  private teleportScrolls: { [key in TeleportItemLocation]?: number };

  public get $inventoryData() {
    return { equipment: this.equipment, items: this.items, size: this.size };
  }

  constructor() {
    super();
    if(!this.equipment) this.equipment = {};
    if(!this.items) this.items = [];
    if(!this.teleportScrolls) this.teleportScrolls = {};
  }

  // basic functions
  private calcSize(player: Player): number {
    return player.$statistics.get('Game/Premium/InventorySize');
  }

  public init(player: Player): void {
    this.updateSize(player);

    this.items = this.items.map(item => {
      const itemRef = new Item();
      itemRef.init(item);
      return itemRef;
    });

    Object.keys(this.equipment).forEach(itemSlot => {
      if(!this.equipment[itemSlot] || !this.equipment[itemSlot].name) {
        this.equipment[itemSlot] = null;
        return;
      }

      const itemRef = new Item();
      itemRef.init(this.equipment[itemSlot]);
      this.equipment[itemSlot] = itemRef;
    });
  }

  public updateSize(player) {
    this.size = this.calcSize(player);
  }

  public isNeedingNewbieItems(): boolean {
    return Object.keys(this.equipment).length === 0;
  }

  public totalItemScore(): number {
    return sumBy(Object.values(this.equipment), item => item ? item.score : 0);
  }

  // equipment-related functions
  public itemInEquipmentSlot(slot: ItemSlot): Item {
    return this.equipment[slot];
  }

  public equipItem(item: Item): void {
    if(!item) return;
    if(!item.type) throw new Error(`Item ${JSON.stringify(item)} has no type so it cannot be equipped.`);

    this.equipment = this.equipment || {};
    this.equipment[item.type] = item;
  }

  public unequipItem(item: Item): void {
    if(!item) return;

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

  public itemsFromInventory(): Item[] {
    return this.items;
  }

  public unlockedItems(): Item[] {
    return this.items.filter(item => !item.locked);
  }

  public clearInventory(): void {
    this.items = [];
  }

  public addTeleportScroll(scroll: TeleportItemLocation): void {
    this.teleportScrolls[scroll] = this.teleportScrolls[scroll] || 0;
    this.teleportScrolls[scroll]++;
  }

  public useTeleportScroll(scroll: TeleportItemLocation): boolean {
    if(this.teleportScrolls[scroll] <= 0) return false;

    this.teleportScrolls[scroll]--;
    return true;
  }

}
