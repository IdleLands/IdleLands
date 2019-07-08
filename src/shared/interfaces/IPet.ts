import { ICharacter } from './IPlayer';
import { ItemSlot } from './IItem';
import { Stat } from './Stat';
import { RestrictedNumber } from 'restricted-number';
import { IAffinity, IAttribute } from './IProfession';

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
  None = 'None',

  // primarily physical attack/skills
  Attacker = 'Attacker',

  // primarily buffs
  Buffer = 'Buffer',

  // primarily offensive spells
  Caster = 'Caster',

  // primarily defensive skills
  Defender = 'Defender',

  // primarily heals
  Healer = 'Healer',

  // primarily debuffs
  Slagger = 'Slagger'

}

export enum PetAttribute {
  Alchemist = 'Alchemist',
  Blessed = 'Blessed',
  Cursed = 'Cursed',
  Golden = 'Golden',
  Fateful = 'Fateful',
  // Mischievous = 'Mischievous', // TODO: ???
  Surging = 'Surging',
  // Thief = 'Thief', // TODO: steal gold from another player
  // Trueseer = 'Trueseer' // TODO: teleport to a random, predetermined location (maeles, vocalnus, norkos, etc)
}

export interface IPet extends ICharacter {

  // if unspecified, it will be randomly chosen
  affinity: PetAffinity;

  // the implementation of the affinity above
  $affinity: IAffinity;

  // if unspecified, it will be randomly chosen (<pet> the <attribute>)
  attribute: PetAttribute;

  // the implementation of the attribute above
  $attribute: IAttribute;

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

  // how much gold the pet can hold
  gold: RestrictedNumber;

  // the current upgrade level values/costs
  currentUpgrade: { [key in PetUpgrade]?: { a?: number, v: number, c: number } };

  // the next upgrade level values/costs
  nextUpgrade: { [key in PetUpgrade]?: { a?: number, v: number, c: number } };

  // the permanent upgrades offered by the pet
  permanentUpgrades: { [key in PermanentPetUpgrade]?: number };

  loop(): void;
  toSaveObject(): any;
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
