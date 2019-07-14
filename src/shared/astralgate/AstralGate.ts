import { BaseGachaRoller } from './BaseGachaRoller';
import { GachaReward, GachaChance, GachaFreeReset } from '../interfaces';

export class AstralGate extends BaseGachaRoller {
  name = 'Astral Gate';
  desc = 'A trip to the Astral Gate can bring you back experience, gold, items, rare pets, and pet enhancing items.';
  rollCost = 10;
  freeResetInterval = GachaFreeReset.Daily;

  rewards = [
    { result: GachaReward.GoldSM,         chance: GachaChance.Common },
    { result: GachaReward.GoldMD,         chance: GachaChance.Uncommon },
    { result: GachaReward.GoldLG,         chance: GachaChance.Rare },

    { result: GachaReward.ItemBasic,      chance: GachaChance.Common },
    { result: GachaReward.ItemPro,        chance: GachaChance.Uncommon },

    { result: GachaReward.XPPlayerSM,     chance: GachaChance.Common },
    { result: GachaReward.XPPlayerMD,     chance: GachaChance.Uncommon },
    { result: GachaReward.XPPlayerLG,     chance: GachaChance.Rare },
    { result: GachaReward.XPPlayerMax,    chance: GachaChance.XXXRare },

    { result: GachaReward.XPPetSM,        chance: GachaChance.Common },
    { result: GachaReward.XPPetMD,        chance: GachaChance.Uncommon },
    { result: GachaReward.XPPetLG,        chance: GachaChance.Rare },
    { result: GachaReward.XPPetMax,       chance: GachaChance.XRare },

    { result: GachaReward.SoulBlue,       chance: GachaChance.XXRare },
    { result: GachaReward.SoulGreen,      chance: GachaChance.XXRare },
    { result: GachaReward.SoulOrange,     chance: GachaChance.XXRare },
    { result: GachaReward.SoulPurple,     chance: GachaChance.XXRare },
    { result: GachaReward.SoulRed,        chance: GachaChance.XXRare },
    { result: GachaReward.SoulYellow,     chance: GachaChance.XXRare },

    { result: GachaReward.CrystalBlue,    chance: GachaChance.Rare },
    { result: GachaReward.CrystalGreen,   chance: GachaChance.Rare },
    { result: GachaReward.CrystalOrange,  chance: GachaChance.Rare },
    { result: GachaReward.CrystalPurple,  chance: GachaChance.Rare },
    { result: GachaReward.CrystalRed,     chance: GachaChance.Rare },
    { result: GachaReward.CrystalYellow,  chance: GachaChance.Rare },
    { result: GachaReward.CrystalAstral,  chance: GachaChance.XRare },
  ];
}

