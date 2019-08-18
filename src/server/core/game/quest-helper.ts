
import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { LootTable } from 'lootastic';
import * as uuid from 'uuid/v4';
import { sample } from 'lodash';

import { IQuest, IQuestObjective, GachaReward, GachaChance } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { World } from './world';
import { AssetManager } from './asset-manager';

const validStats = [
  {
    baseDesc: 'Touch %value treasure chests',
    stat: 'Treasure/Total/Touch',
    baseValue: 5,
    minScalar: 2
  },
  {
    baseDesc: 'Touch %value collectibles',
    stat: 'Item/Collectible/Touch',
    baseValue: 5,
    minScalar: 2
  },
  {
    baseDesc: 'Sell %value items',
    stat: 'Item/Sell/Times',
    baseValue: 5,
    minScalar: 1
  },
  {
    baseDesc: 'Battle %value times',
    stat: 'Event/Battle/Times',
    baseValue: 2,
    minScalar: 1
  },
  {
    baseDesc: 'Spend %value stamina',
    stat: 'Character/Stamina/Spend',
    baseValue: 5,
    minScalar: 2
  },
  {
    baseDesc: 'Gain %value gold',
    stat: 'Character/Gold/Gain',
    baseValue: 10,
    minScalar: 2
  },
  {
    baseDesc: 'Spend %value gold',
    stat: 'Character/Gold/Spend',
    baseValue: 10,
    minScalar: 2
  },
  {
    baseDesc: 'Step %value times',
    stat: 'Character/Movement/Normal',
    baseValue: 10,
    minScalar: 2
  },
  {
    baseDesc: 'Divine-step %value times',
    stat: 'Character/Movement/Divine',
    baseValue: 10,
    minScalar: 2
  },
  {
    baseDesc: 'Drunk-step %value times',
    stat: 'Character/Movement/Drunk',
    baseValue: 10,
    minScalar: 2
  },
  {
    baseDesc: 'Solo-step %value times',
    stat: 'Character/Movement/Solo',
    baseValue: 10,
    minScalar: 2
  }
];

@Singleton
@AutoWired
export class QuestHelper {

  @Inject private assets: AssetManager;
  @Inject private world: World;
  @Inject private rng: RNGService;

  public createQuest(opts = { scalar: 0, map: '', region: '' }): IQuest {

    opts = opts || { scalar: 0, map: '', region: '' };
    if(!opts.scalar) opts.scalar = sample([2, 3, 4, 5]);

    if(!opts.map && this.rng.likelihood(15)) {
      opts.map = sample(this.world.mapNames);
    }

    if(opts.map && this.rng.likelihood(15)) {
      // add region req
    }

    if(!opts.map) opts.scalar++;

    const createObjective = (scalar) => {
      const objectiveData = sample(validStats);

      const objValue = Math.pow(objectiveData.baseValue, scalar);
      let objDesc = objectiveData.baseDesc
                        .split('%value')
                        .join(objValue.toLocaleString());

      if(opts.map) {
        objDesc = `${objDesc} in ${opts.map}`;
      }

      objDesc += '.';
      const basicObjective: IQuestObjective = {
        desc: objDesc,
        scalar: scalar,
        statistic: objectiveData.stat,
        statisticValue: objValue,
        progress: 0,
        requireMap: opts.map
      };

      return basicObjective;
    };

    const objectives = [];
    objectives.push(createObjective(opts.scalar));

    if(opts.scalar > 2 && this.rng.likelihood(30)) {
      objectives.push(createObjective(opts.scalar - 1));
    }

    if(opts.scalar > 3 && this.rng.likelihood(10)) {
      objectives.push(createObjective(opts.scalar - 2));
    }

    const quest: IQuest = {
      id: uuid(),
      name: this.assets.quest(),
      objectives
    };

    return quest;
  }

  public getQuestRewardTable(quest: IQuest): LootTable {
    const totalRewards = quest.objectives.reduce((prev, cur) => prev + cur.scalar, 0);

    const basicRewards = [
      { result: GachaReward.ItemBuffScrollRandom,     chance: GachaChance.XRare },
      { result: GachaReward.ItemPro,                  chance: GachaChance.Uncommon },
    ];

    const moderateRewards = [
      { result: GachaReward.CrystalRed,               chance: GachaChance.Rare },
      { result: GachaReward.CrystalOrange,            chance: GachaChance.Rare },
      { result: GachaReward.CrystalYellow,            chance: GachaChance.Rare },
      { result: GachaReward.CrystalGreen,             chance: GachaChance.Rare },
      { result: GachaReward.CrystalBlue,              chance: GachaChance.Rare },
      { result: GachaReward.CrystalPurple,            chance: GachaChance.Rare },
      { result: GachaReward.ItemIdle,                 chance: GachaChance.Uncommon },
      { result: GachaReward.ItemBuffScrollRandom,     chance: GachaChance.Rare },
    ];

    const advancedRewards = [
      { result: GachaReward.ILPSM,                    chance: GachaChance.Uncommon },
      { result: GachaReward.ItemTeleportScrollACR,    chance: GachaChance.Rare },
      { result: GachaReward.ItemGodly,                chance: GachaChance.Uncommon },
      { result: GachaReward.XPPetLG,                  chance: GachaChance.Uncommon },
      { result: GachaReward.XPPlayerLG,               chance: GachaChance.Uncommon },
      { result: GachaReward.GoldLG,                   chance: GachaChance.Uncommon },
      { result: GachaReward.ItemBuffScrollRandom,     chance: GachaChance.Uncommon },
    ];

    const superRewards = [
      { result: GachaReward.ILPMD,                    chance: GachaChance.Uncommon },
      { result: GachaReward.ItemGoatly,               chance: GachaChance.XRare },
    ];

    const omegaRewards = [
      { result: GachaReward.ILPLG,                    chance: GachaChance.Uncommon },
      { result: GachaReward.ItemOmega,                chance: GachaChance.XXRare },
    ];

    const twoGoalAwards = [
      { result: GachaReward.XPPlayerMax,              chance: GachaChance.Common }
    ];

    const threeGoalAwards = [
      { result: GachaReward.XPPlayerMax,              chance: GachaChance.Always }
    ];

    const chosenRewards = [
      { result: GachaReward.GoldSM,                   chance: GachaChance.VeryCommon },
      { result: GachaReward.XPPlayerSM,               chance: GachaChance.VeryCommon },
      { result: GachaReward.XPPetSM,                  chance: GachaChance.VeryCommon },
    ];

    if(totalRewards >= 3) {
      chosenRewards.push(...basicRewards);
    }

    if(totalRewards >= 6) {
      chosenRewards.push(...moderateRewards);
    }

    if(totalRewards >= 10) {
      chosenRewards.push(...advancedRewards);
    }

    if(totalRewards >= 14) {
      chosenRewards.push(...superRewards);
    }

    if(totalRewards >= 18) {
      chosenRewards.push(...omegaRewards);
    }

    if(quest.objectives.length >= 2) {
      chosenRewards.push(...twoGoalAwards);
    }

    if(quest.objectives.length >= 3) {
      chosenRewards.push(...threeGoalAwards);
    }

    const table = new LootTable(chosenRewards);

    return table;
  }
}
