import { ICharacter, IPlayer } from './IPlayer';
import { ItemSlot, IItem } from './IItem';
import { Stat } from './Stat';
import { RestrictedNumber } from 'restricted-number';
import { IAffinity, IAttribute } from './IProfession';
import { PermanentUpgrade } from './IPremium';

export enum PetUpgrade {

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

  // the level boost calculated as a % of the players level
  ItemFindLevelPercent = 'itemFindLevelPercent',

  // the amount of ILP this pet gathers per tick
  ILPGatherQuantity = 'ilpGatherQuantity',

  // the strength of the pet soul, goes up with ascension typically
  StrongerSoul = 'strongerSoul',

  // the % of the soul to share with the player
  SoulShare = 'soulShare'

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
  Hunter = 'Hunter'

}

export enum PetAttribute {
  Alchemist = 'Alchemist',
  Blessed = 'Blessed',
  Cursed = 'Cursed',
  Golden = 'Golden',
  Fateful = 'Fateful',
  Ferocious = 'Ferocious',
  // Mischievous = 'Mischievous', // TODO: force a battle between this pet and another random pet
  Surging = 'Surging',
  // Thief = 'Thief', // TODO: steal gold from another player
  Trueseer = 'Trueseer'
}

export enum PetUpgradeMaterial {
  CrystalGreen = 'CrystalGreen',
  CrystalYellow = 'CrystalYellow',
  CrystalRed = 'CrystalRed',
  CrystalBlue = 'CrystalBlue',
  CrystalPurple = 'CrystalPurple',
  CrystalOrange = 'CrystalOrange',
  CrystalAstral = 'CrystalAstral'
}

export interface IPet extends ICharacter {

  $$player: IPlayer;

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
  $currentUpgrade: { [key in PetUpgrade]?: { a?: number, v: number, c: number } };

  // the next upgrade level values/costs
  $nextUpgrade: { [key in PetUpgrade]?: { a?: number, v: number, c: number } };

  // the materials required to ascend a pet
  $ascMaterials: any;

  // the permanent upgrades offered by the pet
  permanentUpgrades: { [key in PermanentUpgrade]?: number };

  // the pet equipment slots
  equipment: { [key in ItemSlot]?: IItem[] };

  // the current mission id of the pet
  currentAdventureId: string;

  loop(): void;
  tryEquipAnItemAndReplaceSlotsIfPossible(item: IItem): boolean;
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
    statistics: { [key: string]: number },
    achievements?: Array<{ name: string, tier: number }>,
    collectibles?: string[],
    bosses?: string[]
  };

  maxLevelPerAscension: Array<number>;
  ascensionMaterials: Array<{ [key in PetUpgradeMaterial]?: number }>;

  // v = value, c = cost (in gold), a = ascension required
  upgrades: { [key in PetUpgrade]: Array<{ v: number, c: number, a?: number }> };
  permanentUpgrades: { [key in PermanentUpgrade]?: number };
}
