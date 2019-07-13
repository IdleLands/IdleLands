import { IPlayer } from './IPlayer';

export enum GachaChance {
  Common = 1000,
  Uncommon = 750,
  Rare = 250,
  XRare = 100,
  XXRare = 10,
  XXXRare = 1
}

export enum GachaReward {
  XPPlayerSM = 'xp:player:sm',
  XPPlayerMD = 'xp:player:md',
  XPPlayerLG = 'xp:player:lg',
  XPPlayerMax = 'xp:player:max',

  XPPetSM = 'xp:pet:sm',
  XPPetMD = 'xp:pet:md',
  XPPetLG = 'xp:pet:lg',
  XPPetMax = 'xp:pet:max',

  SoulGreen = 'collectible:soul:green',
  SoulYellow = 'collectible:soul:yellow',
  SoulRed = 'collectible:soul:red',
  SoulBlue = 'collectible:soul:blue',
  SoulPurple = 'collectible:soul:purple',
  SoulOrange = 'collectible:soul:orange',

  CrystalGreen = 'item:crystal:green',
  CrystalYellow = 'item:crystal:yellow',
  CrystalRed = 'item:crystal:red',
  CrystalBlue = 'item:crystal:blue',
  CrystalPurple = 'item:crystal:purple',
  CrystalOrange = 'item:crystal:orange',
  CrystalAstral = 'item:crystal:astral',

  GoldSM = 'gold:player:sm',
  GoldMD = 'gold:player:md',
  GoldLG = 'gold:player:lg',

  ItemBasic = 'item:basic',
  ItemPro = 'item:pro',
  ItemIdle = 'item:idle',
  ItemGodly = 'item:godly',
  ItemGoatly = 'item:goatly',
  ItemOmega = 'item:omega',
}

export interface IGacha {
  name: string;
  rollCost: number;
  requiredToken?: string;

  rewards: Array<{ reward: GachaReward, chance: number }>;

  canRoll(player: IPlayer): boolean;
  roll(): GachaReward;
  roll10(): GachaReward[];
}
