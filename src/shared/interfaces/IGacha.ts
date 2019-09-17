import { IPlayer } from './IPlayer';

export enum GachaFreeReset {
  Daily = 'daily'
}

export enum GachaChance {
  UnbelievablyCommon = 2000,
  VeryCommon = 600,
  Common = 450,
  Uncommon = 300,
  Rare = 200,
  XRare = 100,
  XXRare = 50,
  XXXRare = 10,
  XXXXRare = 1,
  Always = -1
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
  GoldXL = 'gold:player:xl',

  ILPSM = 'ilp:player:sm',
  ILPMD = 'ilp:player:md',
  ILPLG = 'ilp:player:lg',

  ClaySM = 'resource:clay:sm',
  ClayMD = 'resource:clay:md',
  ClayLG = 'resource:clay:lg',

  WoodSM = 'resource:wood:sm',
  WoodMD = 'resource:wood:md',
  WoodLG = 'resource:wood:lg',

  StoneSM = 'resource:stone:sm',
  StoneMD = 'resource:stone:md',
  StoneLG = 'resource:stone:lg',

  AstraliumSM = 'resource:astralium:sm',
  AstraliumMD = 'resource:astralium:md',
  AstraliumLG = 'resource:astralium:lg',

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

  CrystalGreen5 = 'item:Crystal:Green:5',
  CrystalYellow5 = 'item:Crystal:Yellow:5',
  CrystalRed5 = 'item:Crystal:Red:5',
  CrystalBlue5 = 'item:Crystal:Blue:5',
  CrystalPurple5 = 'item:Crystal:Purple:5',
  CrystalOrange5 = 'item:Crystal:Orange:5',
  CrystalAstral5 = 'item:Crystal:Astral:5',

  ItemBasic = 'item:generated:basic',
  ItemPro = 'item:generated:pro',
  ItemIdle = 'item:generated:idle',
  ItemGodly = 'item:generated:godly',
  ItemGoatly = 'item:generated:goatly',
  ItemOmega = 'item:generated:omega',

  EventEnchantment = 'event:chosen:Enchant',

  GuardianItem = 'item:guardian:gear',
  GuardianCollectible = 'collectible:guardian:random',
  HistoricalCollectible = 'collectible:historical:random',

  ItemTeleportScrollRandom = 'item:teleportscroll:random',
  ItemTeleportScrollACR = 'item:teleportscroll:astralcontrolroom',
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
  [GachaReward.GoldXL]: 'Gold (XL)',

  [GachaReward.ILPSM]: 'ILP (Small)',
  [GachaReward.ILPMD]: 'ILP (Medium)',
  [GachaReward.ILPLG]: 'ILP (Large)',

  [GachaReward.WoodSM]: 'Wood (Small)',
  [GachaReward.WoodMD]: 'Wood (Medium)',
  [GachaReward.WoodLG]: 'Wood (Large)',

  [GachaReward.ClaySM]: 'Clay (Small)',
  [GachaReward.ClayMD]: 'Clay (Medium)',
  [GachaReward.ClayLG]: 'Clay (Large)',

  [GachaReward.StoneSM]: 'Stone (Small)',
  [GachaReward.StoneMD]: 'Stone (Medium)',
  [GachaReward.StoneLG]: 'Stone (Large)',

  [GachaReward.AstraliumSM]: 'Astralium (Small)',
  [GachaReward.AstraliumMD]: 'Astralium (Medium)',
  [GachaReward.AstraliumLG]: 'Astralium (Large)',

  [GachaReward.ItemBasic]: 'Item (Basic)',
  [GachaReward.ItemPro]: 'Item (Pro)',
  [GachaReward.ItemIdle]: 'Item (Idle)',
  [GachaReward.ItemGodly]: 'Item (Godly)',
  [GachaReward.ItemGoatly]: 'Item (Goatly)',
  [GachaReward.ItemOmega]: 'Item (Omega)',

  [GachaReward.EventEnchantment]: 'Item Enchantment',

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

  [GachaReward.CrystalGreen5]: 'Pet Crystal (Green x5)',
  [GachaReward.CrystalYellow5]: 'Pet Crystal (Yellow x5)',
  [GachaReward.CrystalRed5]: 'Pet Crystal (Red x5)',
  [GachaReward.CrystalBlue5]: 'Pet Crystal (Blue x5)',
  [GachaReward.CrystalPurple5]: 'Pet Crystal (Purple x5)',
  [GachaReward.CrystalOrange5]: 'Pet Crystal (Orange x5)',
  [GachaReward.CrystalAstral5]: 'Pet Crystal (Astral x5)',

  [GachaReward.ItemTeleportScrollRandom]: 'Teleport Scroll (Random)',
  [GachaReward.ItemTeleportScrollACR]: 'Teleport Scroll (ACR)',
  [GachaReward.ItemBuffScrollRandom]: 'Buff Scroll (Random)'
};

export interface IGacha {
  name: string;
  desc: string;
  rollCost: number;
  requiredToken?: string;
  freeResetInterval?: GachaFreeReset;

  rewards: Array<{ result: GachaReward, chance: GachaChance }>;

  canRoll(player: IPlayer): boolean;
  roll(): GachaReward;
  roll10(): GachaReward[];
}
