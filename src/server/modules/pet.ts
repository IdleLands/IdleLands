import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName, PetUpgrade, ItemSlot } from '../../shared/interfaces';

export class PetOOCAbilityEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetOOCAction;
  description = 'Execute your pets OOC action.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.stamina.total < player.$pets.$activePet.$attribute.oocAbilityCost) return this.gameError('You do not have enough stamina!');

    const msg = player.petOOCAction();
    this.gameMessage(msg);

    this.game.updatePlayer(player);
  }
}

export class PetUpgradeEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetUpgrade;
  description = 'Upgrade one of your pets qualities.';
  args = 'petUpgrade';

  async callback({ petUpgrade } = { petUpgrade: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const upgrade = player.$pets.$activePet.$nextUpgrade[petUpgrade];
    if(!upgrade) return this.gameError('That upgrade level does not exist!');
    if(player.gold < upgrade.c) return this.gameError('You do not have enough gold to do that upgrade!');
    if(upgrade.a && player.$pets.$activePet.rating < upgrade.a) return this.gameError('Your pet is not ascended enough for that upgrade!');

    player.$pets.upgradePet(player, <PetUpgrade>petUpgrade);
    this.gameMessage('Upgraded your pet!');

    this.game.updatePlayer(player);
  }
}
export class BuyPetEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetBuy;
  description = 'Buy a new pet.';
  args = 'petType';

  async callback({ petType } = { petType: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const buyPet = player.$pets.$petsData.buyablePets[petType];
    if(!buyPet) return this.gameError('That pet is not for sale!');
    if(player.gold < buyPet) return this.gameError('You do not have enough gold to do that upgrade!');

    player.$pets.buyPet(player, petType);
    this.gameMessage(`Bought a new ${petType}!`);

    this.game.updatePlayer(player);
  }
}
export class SwapPetEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetSwap;
  description = 'Swap to a different pet.';
  args = 'petType';

  async callback({ petType } = { petType: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const hasPet = player.$pets.$petsData.allPets[petType];
    if(!hasPet) return this.gameError('You do not have that kind of pet available.');

    player.$pets.setActivePet(petType);

    this.game.updatePlayer(player);
  }
}

export class PetEquipItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetEquip;
  description = 'Equip an item from your inventory to your pet.';
  args = 'itemId';

  async callback({ itemId } = { itemId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const foundItem = player.$inventory.getItemFromInventory(itemId);
    if(!foundItem) return this.gameError('Could not find that item in your inventory.');

    const didSucceed = player.$pets.$activePet.equip(foundItem);
    if(!didSucceed) return this.gameError('Could not equip that item.');

    player.$inventory.removeItemFromInventory(foundItem);

    this.game.updatePlayer(player);
    this.gameSuccess(`Equipped ${foundItem.name} to your pet!`);
  }
}

export class PetUnequipItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetUnequip;
  description = 'Unequip an item from your pet.';
  args = 'itemSlot, itemId';

  async callback({ itemSlot, itemId } = { itemSlot: '', itemId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const invHasSpace = player.$inventory.canAddItemsToInventory();
    if(!invHasSpace) return this.gameError('Your inventory is full.');

    const item = player.$pets.$activePet.findEquippedItemById(<ItemSlot>itemSlot, itemId);
    if(!item) return this.gameError('That item is not equipped to your pet.');

    const didSucceed = player.$pets.$activePet.unequip(item);
    if(!didSucceed) return this.gameError('You could not unequip that item.');

    player.$inventory.addItemToInventory(item);

    this.game.updatePlayer(player);
    this.gameSuccess(`Unequipped ${item.name} from your pet!`);
  }
}


export class PetAscendEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetAscend;
  description = 'Ascend your pet.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    const didSucceed = player.$pets.ascend(player);
    if(!didSucceed) return this.gameError('Could not ascend.');

    this.game.updatePlayer(player);
    this.gameSuccess(`Your pet has ascended!`);
  }
}

export class PetAdventureEmbarkEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetAdventureEmbark;
  description = 'Send your pets on an adventure.';
  args = 'adventureId, petIds';

  async callback({ adventureId, petIds } = { adventureId: '', petIds: [] }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const didSucceed = player.$pets.embarkOnPetMission(player, adventureId, petIds);
    if(!didSucceed) return this.gameError('Could not embark on that mission.');

    this.game.updatePlayer(player);
    this.gameSuccess(`You've sent your pets off on another wacky adventure!`);
  }
}

export class PetAdventureCollectEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetAdventureFinish;
  description = 'Collect your pets and rewards from an adventure.';
  args = 'adventureId';

  async callback({ adventureId } = { adventureId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const rewards = player.$pets.cashInMission(player, adventureId);
    if(!rewards) return this.gameError('Could not collect from that mission.');

    this.emit(ServerEventName.PetAdventureRewards, rewards);

    this.game.updatePlayer(player);
    this.gameSuccess(`You've collected your rewards and pets from their adventure!`);
  }
}
