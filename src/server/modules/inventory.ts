
import { ServerEventName, ServerEvent, ItemSlot } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class UnequipItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemUnequip;
  description = 'Unequip an item.';
  args = 'itemSlot';

  async callback({ itemSlot } = { itemSlot: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const item = player.$inventory.itemInEquipmentSlot(<ItemSlot>itemSlot);
    if(!item) return this.gameError('You do not have an item in that slot.');

    const didSucceed = player.unequip(item, true);
    if(!didSucceed) return this.gameError('Your inventory is full.');

    this.game.updatePlayer(player);
    this.gameSuccess(`Unequipped ${item.name}!`);
  }
}

export class EquipItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemEquip;
  description = 'Equip an item.';
  args = 'itemId';

  async callback({ itemId } = { itemId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const foundItem = player.$inventory.getItemFromInventory(itemId);
    if(!foundItem) return this.gameError('Could not find that item in your inventory.');

    const didSucceed = player.equip(foundItem);
    if(!player) return this.notConnected();

    player.$inventory.removeItemFromInventory(foundItem);

    this.game.updatePlayer(player);
    this.gameSuccess(`Equipped ${foundItem.name}!`);
  }
}

export class SellItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemSell;
  description = 'Sell an item.';
  args = 'itemId';

  async callback({ itemId } = { itemId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const foundItem = player.$inventory.getItemFromInventory(itemId);
    if(!foundItem) return this.gameError('Could not find that item in your inventory.');

    const value = player.sellItem(foundItem);
    player.$inventory.removeItemFromInventory(foundItem);

    this.game.updatePlayer(player);
    this.gameSuccess(`Sold ${foundItem.name} for ${value.toLocaleString()} gold!`);
  }
}
