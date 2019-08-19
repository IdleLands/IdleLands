
import { Entity, Column, ObjectIdColumn } from 'typeorm';

import { sortBy } from 'lodash';

import { PlayerOwned } from './PlayerOwned';
import { IQuest, IGlobalQuest } from '../../interfaces';
import { Player } from './Player.entity';

@Entity()
export class Quests extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private quests: IQuest[];

  private $questStats: { [key: string]: string[] };
  private $questHash: { [key: string]: IQuest };

  public get $questsData() {
    return { quests: this.quests };
  }

  constructor() {
    super();
    if(!this.quests) this.quests = [];
    this.$questStats = {};
    this.$questHash = {};
  }

  public init(player: Player) {
    this.updateQuestsBasedOnTotals(player);
    this.registerAllQuests();
  }

  public updateQuestsBasedOnTotals(player: Player) {
    const maxQuests = player.$statistics.get('Game/Premium/Upgrade/MaxQuests');
    if(this.quests.length >= maxQuests) return;

    while(this.quests.length < maxQuests) {
      const quest = player.$$game.questHelper.createQuest();
      this.quests.push(quest);
    }

    this.registerAllQuests();
  }

  private registerAllQuests() {
    this.quests.forEach(q => {
      this.registerQuest(q);
    });
  }

  public checkQuests(player: Player, stat: string, val: number) {
    player.$$game.globalQuestManager.checkAndUpdateStats(player, stat, val);

    const allQuestObjectives = this.$questStats[stat];
    if(!allQuestObjectives) return;

    allQuestObjectives.forEach(qId => {
      const quest = this.$questsData[qId];
      if(!quest) return;

      quest.objectives.forEach(obj => {
        if(obj.statistic !== stat || (obj.map && player.map !== obj.map)) return;

        obj.statisticValue += val;
      });
    });
  }

  public rerollQuest(player: Player, questId: string): boolean {
    const curQuest = this.quests.find(q => q.id === questId);
    if(!curQuest) return;

    this.quests = this.quests.filter(q => q.id !== questId);

    const quest = player.$$game.questHelper.createQuest();
    this.quests.push(quest);

    this.registerQuest(quest);

    return true;
  }

  public registerQuest(quest: IQuest) {
    this.$questHash[quest.id] = quest;

    quest.objectives.forEach(obj => {
      this.$questStats[obj.statistic] = this.$questStats[obj.statistic] || [];
      this.$questStats[obj.statistic].push(quest.id);
    });
  }

  public unregisterQuest(quest: IQuest) {
    delete this.$questHash[quest.id];

    quest.objectives.forEach(obj => {
      this.$questStats[obj.statistic] = this.$questStats[obj.statistic].filter(questId => questId !== quest.id);
    });
  }

  public completeQuest(player: Player, questId: string): boolean|string[] {
    const quest = this.$questHash[questId];
    if(!quest) return false;

    const isComplete = quest.objectives.every(obj => obj.progress >= obj.statisticValue);
    if(!isComplete) return false;

    player.increaseStatistic('Quest/Personal/Total', 1);

    quest.objectives.forEach(obj => {
      player.increaseStatistic('Quest/Personal/Level', obj.scalar);
      player.increaseStatistic('Quest/Personal/Contribution', obj.statisticValue);
    });

    this.rerollQuest(player, quest.id);
    let rewards = this.giveQuestRewards(player, quest);
    rewards = player.$premium.validateAndEarnGachaRewards(player, rewards);

    return rewards;
  }

  public completeGlobalQuest(player: Player, questId: string): boolean|string[] {
    const quest: IGlobalQuest = player.$$game.globalQuestManager.getGlobalQuest(questId);
    if(!quest) return false;

    quest.claimedBy = quest.claimedBy || {};

    if(quest.claimedBy[player.name]) return false;

    const isComplete = quest.objectives.every(obj => obj.progress >= obj.statisticValue)
                    && quest.objectives.some(obj => !!obj.contributions[player.name]);
    if(!isComplete) return false;

    quest.claimedBy[player.name] = true;
    player.$$game.globalQuestManager.initiateUpdateQuest(quest, true);

    player.increaseStatistic('Quest/Global/Total', 1);

    quest.objectives.forEach(obj => {
      if(!obj.contributions[player.name]) return;
      player.increaseStatistic('Quest/Global/Contribution', obj.contributions[player.name]);
    });

    let rewards = this.giveGlobalQuestRewards(player, quest);
    rewards = player.$premium.validateAndEarnGachaRewards(player, rewards);

    return rewards;
  }

  public giveQuestRewards(player: Player, quest: IQuest): string[] {

    const totalRewards = quest.objectives.reduce((prev, cur) => prev + cur.scalar, 0);

    const table = player.$$game.questHelper.getQuestRewardTable(quest);
    const rewards = table.chooseWithReplacement(totalRewards);

    const realRewards = player.$premium.validateAndEarnGachaRewards(player, rewards);
    return realRewards;
  }

  public giveGlobalQuestRewards(player: Player, quest: IGlobalQuest): string[] {
    const rewardMultipliers = { first: 7, second: 5, third: 3, other: 1 };

    const totalSums = {};

    quest.objectives.forEach(obj => {
      Object.keys(obj.contributions).forEach(pl => {
        totalSums[pl] = totalSums[pl] || 0;
        totalSums[pl] += obj.contributions[pl];
      });
    });

    const maxContributions = sortBy(Object.keys(totalSums), pl => totalSums[pl]);

    let rewardKey = 'other';
    if(maxContributions[0] === player.name) rewardKey = 'first';
    if(maxContributions[1] === player.name) rewardKey = 'second';
    if(maxContributions[2] === player.name) rewardKey = 'third';

    const rewards = [];
    for(let i = 0; i < rewardMultipliers[rewardKey]; i++) {
      rewards.push(...quest.rewards[rewardKey]);
    }

    const realRewards = player.$premium.validateAndEarnGachaRewards(player, rewards);
    return realRewards;
  }

}
