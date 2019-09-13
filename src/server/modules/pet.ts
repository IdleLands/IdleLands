
import { sample } from 'lodash';

import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName, PetUpgrade, ItemSlot, PetAffinity } from '../../shared/interfaces';

export class PetOOCAbilityEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetOOCAction;
  description = 'Execute your pets OOC action.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.stamina.total < player.$pets.$activePet.$attribute.oocAbilityCost) return this.gameError('You do not have enough stamina!');

    const result = player.petOOCAction();
    if(result.success === false) return this.gameError(result.message);

    this.gameMessage(result.message);

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
  args = 'itemId, unequipId?, unequipSlot';

  async callback({ itemId, unequipId, unequipSlot } = { itemId: '', unequipId: '', unequipSlot: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(unequipId && unequipSlot) {
      const invHasSpace = player.$inventory.canAddItemsToInventory();
      if(!invHasSpace) return this.gameError('Your inventory is full.');

      const item = player.$pets.$activePet.findEquippedItemById(<ItemSlot>unequipSlot, unequipId);
      if(!item) return this.gameError('That item is not equipped to your pet.');

      const didUnequip = player.$pets.$activePet.unequip(item);
      if(!didUnequip) return this.gameError('You could not unequip that item.');

      player.$inventory.addItemToInventory(item);
    }

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
  description = 'Enhance your pet.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    const didSucceed = player.$pets.ascend(player);
    if(!didSucceed) return this.gameError('Could not enhance. You might be missing some materials!');

    this.game.updatePlayer(player);
    this.gameSuccess(`Your pet has been enhanced!`);
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

export class PetGoldTakeEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetGoldAction;
  description = 'Take gold from your pet.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    const pet = player.$pets.$activePet;
    const gold = pet.gold.total;

    if(gold === 0) return this.gameError('Your pet does not have any gold, you monster!');

    player.gainGold(gold, false);
    pet.gold.set(0);

    this.gameMessage(`You took ${gold.toLocaleString()} gold from your pet.`);

    this.game.updatePlayer(player);
  }
}

export class PetRerollGenderEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetRerollGender;
  description = 'Reroll your pets gender.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    const pet = player.$pets.$activePet;
    const gold = player.gold;

    if(gold < 10000) return this.gameError('You do not have enough gold.');
    player.spendGold(10000);

    const newGender = sample(player.availableGenders);
    pet.gender = newGender;

    this.gameMessage(`Your pets gender is now ${pet.gender}.`);

    this.game.updatePlayer(player);
  }
}

export class PetRerollNameEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetRerollName;
  description = 'Reroll your pets name.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    const pet = player.$pets.$activePet;
    const gold = player.gold;

    if(gold < 50000) return this.gameError('You do not have enough gold.');
    player.spendGold(50000);

    const newName = player.$$game.petHelper.randomName();
    pet.name = newName;

    this.gameMessage(`Your pets name is now ${pet.name}.`);

    this.game.updatePlayer(player);
  }
}

export class PetRerollAffinityEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetRerollAffinity;
  description = 'Reroll your pets affinity.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    const pet = player.$pets.$activePet;
    const gold = player.gold;

    if(pet.affinity === PetAffinity.None) return this.gameError('You cannot reroll non-combat pets!');

    if(gold < 100000) return this.gameError('You do not have enough gold.');
    player.spendGold(100000);

    const newAff = sample(Object.values(PetAffinity).filter(x => x !== PetAffinity.None));
    pet.affinity = newAff;
    player.$$game.petHelper.syncPetAffinity(pet);

    this.gameMessage(`Your pets affinity is now ${pet.affinity}.`);

    this.game.updatePlayer(player);
  }
}

export class PetRerollAttributeEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetRerollAttribute;
  description = 'Reroll your pets attribute.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    const pet = player.$pets.$activePet;
    const gold = player.gold;

    const attrs = player.$achievements.getPetAttributes();
    if(attrs.length === 1) return this.gameError('You do not have any alternate attributes unlocked yet!');

    if(gold < 75000) return this.gameError('You do not have enough gold.');
    player.spendGold(75000);

    const newAttr = sample(attrs);
    pet.attribute = newAttr;
    player.$$game.petHelper.syncPetAttribute(pet);

    this.gameMessage(`Your pets attribute is now ${pet.attribute}.`);

    this.game.updatePlayer(player);
  }
}

