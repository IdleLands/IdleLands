import { Profession } from './IPlayer';

export enum PermanentUpgrade {

  // the permanent inventory size boost for buying this pet
  InventorySizeBoost = 'inventorySizeBoost',

  // the permanent soul storage size boost for buying this pet
  BuffScrollDuration = 'buffScrollDurationBoost',

  // the permanent adventure log size boost for buying this pet
  AdventureLogSizeBoost = 'adventureLogSizeBoost',

  // the permanent choice log size boost for buying this pet
  ChoiceLogSizeBoost = 'choiceLogSizeBoost',

  // the permanent enchant cap boost for buying this pet
  EnchantCapBoost = 'enchantCapBoost',

  // the permanent item stat cap % boost for buying this pet
  ItemStatCapBoost = 'itemStatCapBoost',

  // the permanent item stat cap % boost for buying this pet
  PetMissionCapBoost = 'petMissionCapBoost',

  // the permanent injury threshold for being locked out of combat
  InjuryThreshold = 'injuryThreshold',

  // the number of pets you can bring into combat
  MaxPetsInCombat = 'maxPetsInCombat',

  // the maximum stamina boost you get. stacks with other sources.
  MaxStaminaBoost = 'maxStaminaBoost',

  // the maximum number of quests available to you at any given time
  MaxQuestsCapBoost = 'maxQuestsCapBoost',

  // the % to boost all salvaging by
  SalvageBoost = 'salvageBoost'
}

export enum PremiumTier {
  None = 0,
  Donator = 1,
  Subscriber = 2,
  Subscriber2 = 3,
  Subscriber3 = 4,
  Moderator = 5,
  GM = 10
}

export enum ContributorTier {
  None = 0,
  Contributor = 2
}

export const PremiumScale = {
  [PermanentUpgrade.AdventureLogSizeBoost]: 3,
  [PermanentUpgrade.ChoiceLogSizeBoost]: 5,
  [PermanentUpgrade.EnchantCapBoost]: 15,
  [PermanentUpgrade.InventorySizeBoost]: 20,
  [PermanentUpgrade.BuffScrollDuration]: 10,
  [PermanentUpgrade.ItemStatCapBoost]: 25,
  [PermanentUpgrade.PetMissionCapBoost]: 50,
  [PermanentUpgrade.MaxQuestsCapBoost]: 50,
  [PermanentUpgrade.MaxStaminaBoost]: 2
};

export enum OtherILPPurchase {
  ResetCooldowns = 'resetCooldowns'
}

export const OtherILPCosts: { [key in OtherILPPurchase]: number } = {
  [OtherILPPurchase.ResetCooldowns]: 50
};

export const PremiumGoldCollectibleInfo = {
  ['Pot of Gold'] : {
    name : 'Pot of Gold',
    rarity : 'basic',
    description : 'A small pot containing 100,000 gold.',
    storyline : 'Premium store.'
  },
  ['Cauldron of Gold'] : {
    name : 'Cauldron of Gold',
    rarity : 'basic',
    description : 'A hefty cauldron containing 1 million gold.',
    storyline : 'Premium store.'
  },
  ['Barrel of Gold'] : {
    name : 'Barrel of Gold',
    rarity : 'basic',
    description : 'A large barrel packed to the brim with 10 million gold.',
    storyline : 'Premium store.'
  },
  ['Truck of Gold'] : {
    name : 'Truck of Gold',
    rarity : 'basic',
    description : 'A truck load of gold! 100 million, to be exact.',
    storyline : 'Premium store.'
  },
  ['Castle of Gold'] : {
    name : 'Castle of Gold',
    rarity : 'basic',
    description : 'An entire castle containing 1 billion gold!',
    storyline : 'Premium store.'
  }
};

export const PremiumGoldCollectibles = {
  ['Pot of Gold'] : 100_000,
  ['Cauldron of Gold'] : 1_000_000,
  ['Barrel of Gold'] : 10_000_000,
  ['Truck of Gold'] : 100_000_000,
  ['Castle of Gold'] : 1_000_000_000,
};

export const GoldGenderCost: { [key in Profession]: number } = {
  [Profession.Archer]: 500_000_000,
  [Profession.Barbarian]: 50_000_000,
  [Profession.Bard]: 25_000_000,
  [Profession.Bitomancer]: 25_000_000,
  [Profession.Cleric]: 10_000_000,
  [Profession.Fighter]: 10_000_000,
  [Profession.Generalist]: 10_000_000,
  [Profession.Jester]: 1_000_000_000,
  [Profession.Mage]: 10_000_000,
  [Profession.MagicalMonster]: 100_000_000,
  [Profession.Monster]: 100_000_000,
  [Profession.Necromancer]: 500_000_000,
  [Profession.Pirate]: 50_000_000,
  [Profession.Rogue]: 25_000_000,
  [Profession.SandwichArtist]: 1_000_000
};

export enum IRLPurchase {
  ILPSmall = 'ilp:small',
  ILPMedium = 'ilp:medium',
  ILPLarge = 'ilp:large'
}

export const IRLPurchaseData: { [key in IRLPurchase]: any } = {
  [IRLPurchase.ILPSmall]: {
    key: IRLPurchase.ILPSmall,
    name: '1,000 ILP ($1.00)',
    desc: 'A small amount of ILP for a small price.',
    ilp: 1000,
    cost: 100
  },

  [IRLPurchase.ILPMedium]: {
    key: IRLPurchase.ILPMedium,
    name: '5,000 ILP ($5.00)',
    desc: 'A moderate amount of ILP for a coffee.',
    ilp: 5000,
    cost: 500
  },

  [IRLPurchase.ILPLarge]: {
    key: IRLPurchase.ILPLarge,
    name: '25,000 ILP ($20.00)',
    desc: 'A large amount of ILP for a burger. Or two.',
    ilp: 25000,
    cost: 2000
  }
};
