import { IPlayer } from './IPlayer';

export enum GachaFreeReset {
  Daily = 'daily'
}

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

  GoldSM = 'gold:player:sm',
  GoldMD = 'gold:player:md',
  GoldLG = 'gold:player:lg',

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

  ItemBasic = 'item:basic',
  ItemPro = 'item:pro',
  ItemIdle = 'item:idle',
  ItemGodly = 'item:godly',
  ItemGoatly = 'item:goatly',
  ItemOmega = 'item:omega',
}

export const GachaNameReward: { [key in GachaReward]: string } = {
  [GachaReward.XPPlayerSM]: 'Player XP (Small)',
  [GachaReward.XPPlayerMD]: 'Player XP (Medium)',
  [GachaReward.XPPlayerLG]: 'Player XP (Large)',
  [GachaReward.XPPlayerMax]: 'Player Level Up',

  [GachaReward.XPPetSM]: 'Pet XP (Small)',
  [GachaReward.XPPetMD]: 'Pet XP (Medium)',
  [GachaReward.XPPetLG]: 'Pet XP (Large)',
  [GachaReward.XPPetMax]: 'Pet Level Up',

  [GachaReward.GoldSM]: 'Gold (Small)',
  [GachaReward.GoldMD]: 'Gold (Medium)',
  [GachaReward.GoldLG]: 'Gold (Large)',

  [GachaReward.ItemBasic]: 'Item (Basic)',
  [GachaReward.ItemPro]: 'Item (Pro)',
  [GachaReward.ItemIdle]: 'Item (Idle)',
  [GachaReward.ItemGodly]: 'Item (Godly)',
  [GachaReward.ItemGoatly]: 'Item (Goatly)',
  [GachaReward.ItemOmega]: 'Item (Omega)',

  [GachaReward.SoulGreen]: 'Pet Soul (Green)',
  [GachaReward.SoulYellow]: 'Pet Soul (Yellow)',
  [GachaReward.SoulRed]: 'Pet Soul (Red)',
  [GachaReward.SoulBlue]: 'Pet Soul (Blue)',
  [GachaReward.SoulPurple]: 'Pet Soul (Purple)',
  [GachaReward.SoulOrange]: 'Pet Soul (Orange)',

  [GachaReward.CrystalGreen]: 'Pet Crystal (Green)',
  [GachaReward.CrystalYellow]: 'Pet Crystal (Yellow)',
  [GachaReward.CrystalRed]: 'Pet Crystal (Red)',
  [GachaReward.CrystalBlue]: 'Pet Crystal (Blue)',
  [GachaReward.CrystalPurple]: 'Pet Crystal (Purple)',
  [GachaReward.CrystalOrange]: 'Pet Crystal (Orange)',
  [GachaReward.CrystalAstral]: 'Pet Crystal (Astral)',
};

export interface IGacha {
  name: string;
  desc: string;
  rollCost: number;
  requiredToken?: string;
  freeResetInterval?: GachaFreeReset;

  rewards: Array<{ reward: GachaReward, chance: number }>;

  canRoll(player: IPlayer): boolean;
  roll(): GachaReward;
  roll10(): GachaReward[];
}
