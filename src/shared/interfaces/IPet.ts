import { ICharacter } from './IPlayer';
import { ItemSlot } from './IItem';
import { Stat } from './Stat';

export enum PermanentPetUpgrade {

  // the permanent inventory size boost for buying this pet
  InventorySizeBoost = 'inventorySizeBoost',

  // the permanent soul storage size boost for buying this pet
  SoulStashSizeBoost = 'soulStashSizeBoost',

  // the permanent adventure log size boost for buying this pet
  AdventureLogSizeBoost = 'adventureLogSizeBoost',

  // the permanent choice log size boost for buying this pet
  ChoiceLogSizeBoost = 'choiceLogSizeBoost',

  // the permanent enchant cap boost for buying this pet
  EnchantCapBoost = 'enchantCapBoost',

  // the permanent item stat cap % boost for buying this pet
  ItemStatCapBoost = 'itemStatCapBoost'

}

export enum PetUpgrade {

  // the pets max level
  MaxLevel = 'maxLevel',

  // how much gold the pet can hold
  GoldStorage = 'goldStorage',

  // the likelihood of the pet joining the battle
  BattleJoinPercent = 'battleJoinPercent',

  // how long it takes (in seconds) for a pet to find an item and ilp
  GatherTime = 'gatherTime',

  // the quality boost (1..5) for the pet item find generator
  ItemFindQualityBoost = 'itemFindQualityBoost',

  // the level boost (1..5000) for the pet item find generator
  ItemFindLevelBoost = 'itemFindLevelBoost',

  // the amount of ILP this pet gathers per tick
  ILPGatherQuantity = 'ilpGatherQuantity'

}

export enum PetAffinity {

  // non-combat
  None = 'none',

  // primarily physical attack/skills
  Attacker = 'attacker',

  // primarily buffs
  Buffer = 'buffer',

  // primarily offensive spells
  Caster = 'caster',

  // primarily defensive skills
  Defender = 'defender',

  // primarily heals
  Healer = 'healer',

  // primarily debuffs
  Slagger = 'slagger'

}

export enum PetAttribute {
  Alchemist = 'alchemist',
  Blessed = 'blessed',
  Fateful = 'fateful',
  Mischievous = 'mischievous',
  Surging = 'surging',
  Thief = 'thief',
  Trueseer = 'trueseer'
}

export interface IPet extends ICharacter {

  // if unspecified, it will be randomly chosen
  affinity: PetAffinity;

  // if unspecified, it will be randomly chosen (<pet> the <attribute>)
  attribute: PetAttribute;

  // rating is 1..5 - starts at 1, but can be upgraded
  rating: number;

  // the pet name
  name: string;

  // the type name of the pet (Pet Rock, etc)
  typeName: string;

  // the tick for the next item find & ilp gather
  gatherTick: number;

  // the current upgrade level for each pet upgrade
  upgradeLevels: { [key in PetUpgrade]?: number };
}

export interface IPetProto {
  affinity: PetAffinity;
  attribute: PetAttribute;
  rating: number;

  typeName: string;

  cost: number;
  equipmentSlots: { [key in ItemSlot]?: number };
  soulStats: { [key in Stat]?: number };

  requirements: {
    statistics?: { [key: string]: number },
    achievements?: Array<{ name: string, tier: number }>,
    collectibles?: string[],
    bosses?: string[]
  };

  // v = value, c = cost (in gold), a = ascension required
  upgrades: { [key in PetUpgrade]: Array<{ v: number, c: number, a?: number }> };
  permanentUpgrades: { [key in PermanentPetUpgrade]?: number };
}
