
import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { LootTable } from 'lootastic';
import * as uuid from 'uuid/v4';
import { sample } from 'lodash';

import { IQuest, IQuestObjective, GachaReward, GachaChance, IGlobalQuest } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { World } from './world';
import { AssetManager } from './asset-manager';

const validStats = [
  {
    baseDesc: 'Touch %value treasure chests',
    stat: 'Treasure/Total/Touch',
    baseValue: 5,
    minScalar: 2,
    maxScalar: 5,
    noMap: true
  },
  {
    baseDesc: 'Touch %value collectibles',
    stat: 'Item/Collectible/Touch',
    baseValue: 5,
    minScalar: 2,
    maxScalar: 5,
    noMap: true
  },
  {
    baseDesc: 'Sell %value items',
    stat: 'Item/Sell/Times',
    baseValue: 5,
    minScalar: 1,
    maxScalar: 3
  },
  {
    baseDesc: 'Battle %value times',
    stat: 'Combat/All/Times/Total',
    baseValue: 2,
    minScalar: 1,
    maxScalar: 3
  },
  {
    baseDesc: 'Spend %value stamina',
    stat: 'Character/Stamina/Spend',
    baseValue: 5,
    minScalar: 2,
    maxScalar: 4
  },
  {
    baseDesc: 'Gain %value gold',
    stat: 'Character/Gold/Gain',
    baseValue: 100,
    minScalar: 3,
    maxScalar: 4
  },
  {
    baseDesc: 'Spend %value gold',
    stat: 'Character/Gold/Spend',
    baseValue: 100,
    minScalar: 3,
    maxScalar: 4
  },
  {
    baseDesc: 'Step %value times',
    stat: 'Character/Movement/Steps/Normal',
    baseValue: 10,
    minScalar: 3,
    maxScalar: 7
  },
  {
    baseDesc: 'Divine-step %value times',
    stat: 'Character/Movement/Steps/Divine',
    baseValue: 10,
    minScalar: 2,
    maxScalar: 7
  },
  {
    baseDesc: 'Drunk-step %value times',
    stat: 'Character/Movement/Steps/Drunk',
    baseValue: 10,
    minScalar: 3,
    maxScalar: 7
  },
  {
    baseDesc: 'Solo-step %value times',
    stat: 'Character/Movement/Steps/Solo',
    baseValue: 10,
    minScalar: 3,
    maxScalar: 7
  }
];

@Singleton
@AutoWired
export class QuestHelper {

  @Inject private assets: AssetManager;
  @Inject private world: World;
  @Inject private rng: RNGService;

  createObjective(scalar: number, map: string, overrideBaseValue = 0) {
    const objectiveData = sample(
      validStats
        .filter(obj => obj.minScalar <= scalar
                    && obj.maxScalar >= scalar
                    && (map ? !obj.noMap : true))
    );

    objectiveData.baseValue = overrideBaseValue || objectiveData.baseValue;

    const objValue = Math.pow(objectiveData.baseValue, scalar);
    let objDesc = objectiveData.baseDesc
                      .split('%value')
                      .join(objValue.toLocaleString());

    if(map) {
      objDesc = `${objDesc} in ${map}`;
    }

    objDesc += '.';
    const basicObjective: IQuestObjective = {
      desc: objDesc,
      scalar: scalar,
      statistic: objectiveData.stat,
      statisticValue: objValue,
      progress: 0,
      requireMap: map
    };

    return basicObjective;
  }

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

    const objectives = [];
    objectives.push(this.createObjective(opts.scalar, opts.map));

    if(opts.scalar > 2 && this.rng.likelihood(30)) {
      objectives.push(this.createObjective(opts.scalar - 1, opts.map));
    }

    if(opts.scalar > 3 && this.rng.likelihood(10)) {
      objectives.push(this.createObjective(opts.scalar - 2, opts.map));
    }

    const quest: IQuest = {
      id: uuid(),
      name: this.assets.quest(),
      objectives
    };

    return quest;
  }

  public createGlobalQuest(): IGlobalQuest {
    const opts = { map: '', scalar: 6 };

    opts.map = sample(
      this.world.mapNames
        .filter(x => this.world.getMap(x).allRegions.length >= 7)
    );

    const objectives = [];
    objectives.push(this.createObjective(opts.scalar, opts.map, 10));
    objectives.push(this.createObjective(opts.scalar - 1, opts.map, 10));
    objectives.push(this.createObjective(opts.scalar - 2, opts.map, 10));
    objectives.push(this.createObjective(opts.scalar - 3, opts.map, 10));
    objectives.push(this.createObjective(opts.scalar - 3, opts.map, 10));

    const endsAt = new Date();
    endsAt.setDate(endsAt.getDate() + 7);

    const quest: IGlobalQuest = {
      id: uuid(),
      name: this.assets.globalQuest(opts.map),
      objectives,
      endsAt: endsAt.getTime(),
      claimedBy: {},
      rewards: this.getRewardsForGlobalQuest()
    };

    quest.objectives.forEach(obj => {
      obj.contributions = {};
    });

    return quest;
  }

  public getRewardsForGlobalQuest(): { first, second, third, other } {

    const rewardChoices = [

      // 200 ilp
      [GachaReward.ILPLG, GachaReward.ILPLG],

      // 10 astral crystals
      [GachaReward.CrystalAstral5],

      // 5 of all crystals
      [GachaReward.CrystalBlue5, GachaReward.CrystalGreen5, GachaReward.CrystalOrange5,
       GachaReward.CrystalPurple5, GachaReward.CrystalRed5, GachaReward.CrystalYellow5],

      // 3 levelups
      [GachaReward.XPPlayerMax, GachaReward.XPPlayerMax, GachaReward.XPPlayerMax],

      // 1 goatly item
      [GachaReward.ItemGoatly]
    ];

    const rewards = {
      first: sample(rewardChoices),
      second: sample(rewardChoices),
      third: sample(rewardChoices),
      other: sample(rewardChoices)
    };

    return rewards;
  }

  public getQuestRewardTable(quest: IQuest): LootTable {
    const totalRewards = quest.objectives.reduce((prev, cur) => prev + cur.scalar, 0);

    const basicRewards = [
      { result: GachaReward.GoldMD,                   chance: GachaChance.Common },
      { result: GachaReward.XPPlayerMD,               chance: GachaChance.Common },
      { result: GachaReward.XPPetMD,                  chance: GachaChance.Common },
      { result: GachaReward.ItemBasic,                chance: GachaChance.Common },
    ];

    const moderateRewards = [
      { result: GachaReward.ItemPro,                  chance: GachaChance.Uncommon },
      { result: GachaReward.CrystalRed,               chance: GachaChance.Rare },
      { result: GachaReward.CrystalOrange,            chance: GachaChance.Rare },
      { result: GachaReward.CrystalYellow,            chance: GachaChance.Rare },
      { result: GachaReward.CrystalGreen,             chance: GachaChance.Rare },
      { result: GachaReward.CrystalBlue,              chance: GachaChance.Rare },
      { result: GachaReward.CrystalPurple,            chance: GachaChance.Rare },
      { result: GachaReward.ItemIdle,                 chance: GachaChance.Uncommon },
    ];

    const advancedRewards = [
      { result: GachaReward.CrystalAstral,            chance: GachaChance.Rare },
      { result: GachaReward.ItemBuffScrollRandom,     chance: GachaChance.XRare },
      { result: GachaReward.ILPSM,                    chance: GachaChance.Uncommon },
      { result: GachaReward.ItemTeleportScrollACR,    chance: GachaChance.Rare },
      { result: GachaReward.ItemGodly,                chance: GachaChance.Rare },
      { result: GachaReward.XPPetLG,                  chance: GachaChance.Common },
      { result: GachaReward.XPPlayerLG,               chance: GachaChance.Common },
      { result: GachaReward.GoldLG,                   chance: GachaChance.Common },
    ];

    const superRewards = [
      { result: GachaReward.ItemBuffScrollRandom,     chance: GachaChance.Uncommon },
      { result: GachaReward.ILPMD,                    chance: GachaChance.Uncommon },
      { result: GachaReward.ItemGoatly,               chance: GachaChance.XRare },
    ];

    const omegaRewards = [
      { result: GachaReward.ILPLG,                    chance: GachaChance.Uncommon },
      { result: GachaReward.ItemOmega,                chance: GachaChance.XXRare },
    ];

    const twoGoalAwards = [
      { result: GachaReward.XPPlayerMax,              chance: GachaChance.Uncommon }
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
