
import { ServerEventName, ServerEvent, ItemSlot, TeleportItemLocation } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class UnequipItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemUnequip;
  description = 'Unequip an item from your inventory.';
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
  description = 'Equip an item from your inventory.';
  args = 'itemId';

  async callback({ itemId } = { itemId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const foundItem = player.$inventory.getItemFromInventory(itemId);
    if(!foundItem) return this.gameError('Could not find that item in your inventory.');

    player.$inventory.removeItemFromInventory(foundItem);

    const didSucceed = player.equip(foundItem);
    if(!didSucceed) {
      player.$inventory.addItemToInventory(foundItem);
      return this.gameError('Could not equip that item.');
    }

    this.game.updatePlayer(player);
    this.gameSuccess(`Equipped ${foundItem.name}!`);
  }
}

export class SellItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemSell;
  description = 'Sell an item in your inventory.';
  args = 'itemId';

  async callback({ itemId } = { itemId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const foundItem = player.$inventory.getItemFromInventory(itemId);
    if(!foundItem) return this.gameError('Could not find that item in your inventory.');

    if(foundItem.locked) return this.gameError('Item is currently locked. Unlock it to sell it.');

    const value = player.sellItem(foundItem);
    player.$inventory.removeItemFromInventory(foundItem);

    this.game.updatePlayer(player);
    this.gameSuccess(`Sold ${foundItem.name} for ${value.toLocaleString()} gold!`);
  }
}

export class LockItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemLock;
  description = 'Lock an item in your inventory.';
  args = 'itemId?, itemSlot?';

  async callback({ itemId, itemSlot } = { itemId: '', itemSlot: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(!itemId && !itemSlot) return this.gameError('Need to specify either itemId or itemSlot');

    let foundItem = null;

    if(itemId) {
      foundItem = player.$inventory.getItemFromInventory(itemId);
      if(!foundItem) return this.gameError('Could not find that item in your inventory.');
    } else if(itemSlot) {
      foundItem = player.$inventory.itemInEquipmentSlot(<ItemSlot>itemSlot);
      if(!foundItem) return this.gameError('There is nothing equipped in that slot.');
    }

    foundItem.locked = true;

    this.game.updatePlayer(player);
    this.gameSuccess(`Locked ${foundItem.name}! It will not be automatically sold or salvaged.`);
  }
}
export class UnlockItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemUnlock;
  description = 'Unlock an item in your inventory.';
  args = 'itemId?, itemSlot?';

  async callback({ itemId, itemSlot } = { itemId: '', itemSlot: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(!itemId && !itemSlot) return this.gameError('Need to specify either itemId or itemSlot');

    let foundItem = null;

    if(itemId) {
      foundItem = player.$inventory.getItemFromInventory(itemId);
      if(!foundItem) return this.gameError('Could not find that item in your inventory.');
    } else if(itemSlot) {
      foundItem = player.$inventory.itemInEquipmentSlot(<ItemSlot>itemSlot);
      if(!foundItem) return this.gameError('There is nothing equipped in that slot.');
    }

    foundItem.locked = false;

    this.game.updatePlayer(player);
    this.gameSuccess(`Unlocked ${foundItem.name}! It may be automatically sold or salvaged.`);
  }
}

export class SellAllEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemSellAll;
  description = 'Sell all items in your inventory.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    let numItems = 0;
    let totalValue = 0;

    const items = player.$inventory.itemsFromInventory();
    const removeItems = [];
    items.forEach(item => {
      if(item.locked) return;

      const value = player.sellItem(item);
      removeItems.push(item);

      numItems++;
      totalValue += value;
    });

    player.$inventory.removeItemFromInventory(...removeItems);

    this.game.updatePlayer(player);
    this.gameSuccess(`Sold ${numItems} item(s) for ${totalValue.toLocaleString()} gold!`);
  }
}

export class UseTeleportScrollEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemTeleportScroll;
  description = 'Use a teleport scroll in your inventory.';
  args = 'scroll';

  async callback({ scroll } = { scroll: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const didWork = player.$inventory.useTeleportScroll(player, <TeleportItemLocation>scroll);
    if(!didWork) return this.gameError('Could not teleport. You might already be in that region or your scroll count might be 0!');

    this.game.updatePlayer(player);
    this.gameSuccess(`You teleported to ${scroll}!`);
  }
}

export class UseBuffScrollEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ItemBuffScroll;
  description = 'Use a booster scroll in your inventory.';
  args = 'scrollId';

  async callback({ scrollId } = { scrollId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const didWork = player.$inventory.useBuffScroll(player, scrollId);
    if(!didWork) return this.gameError('Could not use scroll. It might not be there or is expired!');

    this.game.updatePlayer(player);
    this.gameSuccess(`You used the scroll!`);
  }
}
