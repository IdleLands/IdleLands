import { GachaReward, GachaChance } from './IGacha';
import { IPlayer } from './IPlayer';

export enum AdventureDuration {
  VeryShort = 2,
  Short = 4,
  Medium = 8,
  Long = 16,
  VeryLong = 24
}

export enum AdventureType {
  Combat = 'combat',
  MerchantGuild = 'merchantguild',
  BossHunt = 'bosshunt',
  TimeTravel = 'timetravel',
  MagicalItemSearch = 'magicalitemsearch',
  EnhancementSearch = 'enhancementsearch',
  Adventure = 'adventure',
  AdventurersGraveyard = 'adventurersgraveyard'
}

export const AdventureNames: { [key in AdventureType]: string } = {
  [AdventureType.Combat]: 'Training Adventure',
  [AdventureType.MerchantGuild]: 'Trip to the Merchant Guild',
  [AdventureType.BossHunt]: 'Guardian Hunt',
  [AdventureType.TimeTravel]: 'Time Travel Adventure (Rare)',
  [AdventureType.MagicalItemSearch]: 'Magical Item Search (Rare)',
  [AdventureType.EnhancementSearch]: 'Pet Enhancement Material Search',
  [AdventureType.Adventure]: 'Idle Adventure',
  [AdventureType.AdventurersGraveyard]: 'Graverobbing the Adventurers Graveyard'
};

export const AdventureDescriptions: { [key in AdventureType]: string } = {
  [AdventureType.Combat]: 'Seek out foes to earn gold and experience.',
  [AdventureType.MerchantGuild]: 'Send your pets off to buy and sell items from the Merchant Guild.',
  [AdventureType.BossHunt]: 'Seek and attempt to defeat a guardian of the realm.',
  [AdventureType.TimeTravel]: 'Travel through time and attempt to bring back historical items.',
  [AdventureType.MagicalItemSearch]: 'Search for magical items in the realm of Idliathlia.',
  [AdventureType.EnhancementSearch]: 'Hunt down pet enhancement materials.',
  [AdventureType.Adventure]: 'Set sail on the winds of adventure.',
  [AdventureType.AdventurersGraveyard]: 'Go to the olde Adventurer Graveyard and bring back an item.'
};

export const AdventureRequirements: { [key in AdventureType]?: (player: IPlayer) => boolean } = {
  [AdventureType.TimeTravel]: (player) => player.ascensionLevel > 0
};

export const AdventureRewards: { [key in AdventureType]: Array<{ result: GachaReward, chance: GachaChance }> } = {
  [AdventureType.Combat]: [
    { result: GachaReward.XPPetSM,                  chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPetMD,                  chance: GachaChance.Common },
    { result: GachaReward.XPPetLG,                  chance: GachaChance.Uncommon },
    { result: GachaReward.XPPetMax,                 chance: GachaChance.XXRare },

    { result: GachaReward.XPPlayerSM,               chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPlayerMD,               chance: GachaChance.Common },
    { result: GachaReward.XPPlayerLG,               chance: GachaChance.Uncommon },
    { result: GachaReward.XPPlayerMax,              chance: GachaChance.XXXRare },

    { result: GachaReward.GoldSM,                   chance: GachaChance.VeryCommon },
    { result: GachaReward.GoldMD,                   chance: GachaChance.Common },
    { result: GachaReward.GoldLG,                   chance: GachaChance.Uncommon }
  ],
  [AdventureType.MerchantGuild]: [
    { result: GachaReward.GoldSM,                   chance: GachaChance.VeryCommon },
    { result: GachaReward.GoldMD,                   chance: GachaChance.Common },
    { result: GachaReward.GoldLG,                   chance: GachaChance.Uncommon },

    { result: GachaReward.ItemBasic,                chance: GachaChance.Rare },
    { result: GachaReward.ItemPro,                  chance: GachaChance.XRare },
    { result: GachaReward.ItemIdle,                 chance: GachaChance.XXRare },

    { result: GachaReward.ItemBuffScrollRandom,     chance: GachaChance.Rare },
    { result: GachaReward.ItemTeleportScrollRandom, chance: GachaChance.Rare }
  ],
  [AdventureType.BossHunt]: [
    { result: GachaReward.XPPetSM,                  chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPetMD,                  chance: GachaChance.Common },
    { result: GachaReward.XPPetLG,                  chance: GachaChance.Uncommon },
    { result: GachaReward.XPPetMax,                 chance: GachaChance.XXRare },

    { result: GachaReward.XPPlayerSM,               chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPlayerMD,               chance: GachaChance.Common },
    { result: GachaReward.XPPlayerLG,               chance: GachaChance.Uncommon },
    { result: GachaReward.XPPlayerMax,              chance: GachaChance.XXXRare },

    { result: GachaReward.GoldSM,                   chance: GachaChance.VeryCommon },
    { result: GachaReward.GoldMD,                   chance: GachaChance.Common },
    { result: GachaReward.GoldLG,                   chance: GachaChance.Uncommon },

    { result: GachaReward.GuardianCollectible,      chance: GachaChance.XRare },
    { result: GachaReward.GuardianItem,             chance: GachaChance.Rare }
  ],
  [AdventureType.TimeTravel]: [
    { result: GachaReward.XPPetSM,                  chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPlayerSM,               chance: GachaChance.VeryCommon },
    { result: GachaReward.HistoricalCollectible,    chance: GachaChance.XXRare }
  ],
  [AdventureType.MagicalItemSearch]: [
    { result: GachaReward.XPPetSM,                  chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPlayerSM,               chance: GachaChance.VeryCommon },

    { result: GachaReward.ItemBuffScrollRandom,     chance: GachaChance.Rare },
    { result: GachaReward.ItemTeleportScrollRandom, chance: GachaChance.Rare }
  ],
  [AdventureType.EnhancementSearch]: [
    { result: GachaReward.XPPetSM,                  chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPetMD,                  chance: GachaChance.Common },
    { result: GachaReward.XPPetLG,                  chance: GachaChance.Uncommon },
    { result: GachaReward.XPPetMax,                 chance: GachaChance.XRare },

    { result: GachaReward.CrystalRed,               chance: GachaChance.Rare },
    { result: GachaReward.CrystalOrange,            chance: GachaChance.Rare },
    { result: GachaReward.CrystalYellow,            chance: GachaChance.Rare },
    { result: GachaReward.CrystalGreen,             chance: GachaChance.Rare },
    { result: GachaReward.CrystalBlue,              chance: GachaChance.Rare },
    { result: GachaReward.CrystalPurple,            chance: GachaChance.Rare },

    { result: GachaReward.SoulRed,                  chance: GachaChance.XXRare },
    { result: GachaReward.SoulOrange,               chance: GachaChance.XXRare },
    { result: GachaReward.SoulYellow,               chance: GachaChance.XXRare },
    { result: GachaReward.SoulGreen,                chance: GachaChance.XXRare },
    { result: GachaReward.SoulBlue,                 chance: GachaChance.XXRare },
    { result: GachaReward.SoulPurple,               chance: GachaChance.XXRare },
  ],
  [AdventureType.Adventure]: [
    { result: GachaReward.XPPetSM,                  chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPetMD,                  chance: GachaChance.Common },
    { result: GachaReward.XPPetLG,                  chance: GachaChance.Uncommon },

    { result: GachaReward.XPPlayerSM,               chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPlayerMD,               chance: GachaChance.Common },
    { result: GachaReward.XPPlayerLG,               chance: GachaChance.Uncommon },

    { result: GachaReward.CrystalRed,               chance: GachaChance.XRare },
    { result: GachaReward.CrystalOrange,            chance: GachaChance.XRare },
    { result: GachaReward.CrystalYellow,            chance: GachaChance.XRare },
    { result: GachaReward.CrystalGreen,             chance: GachaChance.XRare },
    { result: GachaReward.CrystalBlue,              chance: GachaChance.XRare },
    { result: GachaReward.CrystalPurple,            chance: GachaChance.XRare },

    { result: GachaReward.ItemBuffScrollRandom,     chance: GachaChance.Rare },
    { result: GachaReward.ItemTeleportScrollRandom, chance: GachaChance.Rare },

    { result: GachaReward.ItemBasic,                chance: GachaChance.Rare }
  ],
  [AdventureType.AdventurersGraveyard]: [
    { result: GachaReward.XPPetSM,                  chance: GachaChance.VeryCommon },
    { result: GachaReward.XPPlayerSM,               chance: GachaChance.VeryCommon },

    { result: GachaReward.ItemBasic,                chance: GachaChance.Rare },
    { result: GachaReward.ItemPro,                  chance: GachaChance.XRare },
    { result: GachaReward.ItemIdle,                 chance: GachaChance.XXRare },
  ]
};

export const AdventureChances: Array<{ chance: GachaChance, result: AdventureType }> = [
  { result: AdventureType.Adventure,            chance: GachaChance.Common },
  { result: AdventureType.Combat,               chance: GachaChance.Common },
  { result: AdventureType.BossHunt,             chance: GachaChance.Common },
  { result: AdventureType.TimeTravel,           chance: GachaChance.Common },
  { result: AdventureType.MerchantGuild,        chance: GachaChance.Common },
  { result: AdventureType.EnhancementSearch,    chance: GachaChance.Common },
  { result: AdventureType.AdventurersGraveyard, chance: GachaChance.Common },
  { result: AdventureType.MagicalItemSearch,    chance: GachaChance.Common }
];

export const AdventureDurationChances: Array<{ chance: GachaChance, result: AdventureDuration }> = [
  { result: AdventureDuration.VeryShort,       chance: GachaChance.Rare },
  { result: AdventureDuration.Short,           chance: GachaChance.Uncommon },
  { result: AdventureDuration.Medium,          chance: GachaChance.Common },
  { result: AdventureDuration.Long,            chance: GachaChance.Uncommon },
  { result: AdventureDuration.VeryLong,        chance: GachaChance.XRare },
];

export const BaseAdventureRewardCount: { [key in AdventureDuration]: number } = {
  [AdventureDuration.VeryShort]:  1,
  [AdventureDuration.Short]:      1.5,
  [AdventureDuration.Medium]:     2,
  [AdventureDuration.Long]:       2.5,
  [AdventureDuration.VeryLong]:   4,
};

export interface IAdventure {
  id: string;
  type: AdventureType;
  duration: AdventureDuration;
  finishAt: number;
}
