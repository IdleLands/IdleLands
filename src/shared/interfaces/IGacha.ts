import { IPlayer } from './IPlayer';

export enum GachaFreeReset {
  Daily = 'daily'
}

export enum GachaChance {
  Common = 450,
  Uncommon = 300,
  Rare = 200,
  XRare = 100,
  XXRare = 50,
  XXXRare = 10
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

  ILPSM = 'ilp:player:sm',
  ILPMD = 'ilp:player:md',
  ILPLG = 'ilp:player:lg',

  SoulGreen = 'collectible:Soul:Green',
  SoulYellow = 'collectible:Soul:Yellow',
  SoulRed = 'collectible:Soul:Red',
  SoulBlue = 'collectible:Soul:Blue',
  SoulPurple = 'collectible:Soul:Purple',
  SoulOrange = 'collectible:Soul:Orange',

  CrystalGreen = 'item:Crystal:Green',
  CrystalYellow = 'item:Crystal:Yellow',
  CrystalRed = 'item:Crystal:Red',
  CrystalBlue = 'item:Crystal:Blue',
  CrystalPurple = 'item:Crystal:Purple',
  CrystalOrange = 'item:Crystal:Orange',
  CrystalAstral = 'item:Crystal:Astral',

  ItemBasic = 'item:generated:basic',
  ItemPro = 'item:generated:pro',
  ItemIdle = 'item:generated:idle',
  ItemGodly = 'item:generated:godly',
  ItemGoatly = 'item:generated:goatly',
  ItemOmega = 'item:generated:omega',

  GuardianItem = 'item:guardian:gear',
  GuardianCollectible = 'item:guardian:collectible',
  HistoricalCollectible = 'item:historical:collectible',

  ItemTeleportScrollRandom = 'item:teleportscroll:random',
  ItemBuffScrollRandom = 'item:buffscroll:random'
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

  [GachaReward.ILPSM]: 'ILP (Small)',
  [GachaReward.ILPMD]: 'ILP (Medium)',
  [GachaReward.ILPLG]: 'ILP (Large)',

  [GachaReward.ItemBasic]: 'Item (Basic)',
  [GachaReward.ItemPro]: 'Item (Pro)',
  [GachaReward.ItemIdle]: 'Item (Idle)',
  [GachaReward.ItemGodly]: 'Item (Godly)',
  [GachaReward.ItemGoatly]: 'Item (Goatly)',
  [GachaReward.ItemOmega]: 'Item (Omega)',

  [GachaReward.GuardianItem]: 'Item (Guardian)',
  [GachaReward.GuardianCollectible]: 'Collectible (Guardian)',

  [GachaReward.HistoricalCollectible]: 'Collectible (Historical)',

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

  [GachaReward.ItemTeleportScrollRandom]: 'Teleport Scroll (Random)',
  [GachaReward.ItemBuffScrollRandom]: 'Buff Scroll (Random)'
};

export interface IGacha {
  name: string;
  desc: string;
  rollCost: number;
  requiredToken?: string;
  freeResetInterval?: GachaFreeReset;

  rewards: Array<{ result: GachaReward, chance: number }>;

  canRoll(player: IPlayer): boolean;
  roll(): GachaReward;
  roll10(): GachaReward[];
}
