import { BaseGachaRoller } from './BaseGachaRoller';
import { GachaReward, GachaChance } from '../interfaces';

export class ResourceGate extends BaseGachaRoller {
  name = 'Resource Gate';
  desc = 'A trip to the Resource Gate can bring you back salvage items.';
  rollCost = 250000;
  requiredToken = 'Gold';

  rewards = [
    { result: GachaReward.ClaySM,         chance: GachaChance.Uncommon },
    { result: GachaReward.WoodSM,         chance: GachaChance.Uncommon },
    { result: GachaReward.StoneSM,        chance: GachaChance.Uncommon },
    { result: GachaReward.AstraliumSM,    chance: GachaChance.Rare },

    { result: GachaReward.ClayMD,         chance: GachaChance.Rare },
    { result: GachaReward.WoodMD,         chance: GachaChance.Rare },
    { result: GachaReward.StoneMD,        chance: GachaChance.Rare },
    { result: GachaReward.AstraliumMD,    chance: GachaChance.XRare },

    { result: GachaReward.ClayLG,         chance: GachaChance.XRare },
    { result: GachaReward.WoodLG,         chance: GachaChance.XRare },
    { result: GachaReward.StoneLG,        chance: GachaChance.XRare },
    { result: GachaReward.AstraliumLG,    chance: GachaChance.XXRare }
  ];
}

