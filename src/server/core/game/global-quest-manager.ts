import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { extend } from 'lodash';

import { DatabaseManager } from './database-manager';
import { GlobalQuests } from '../../../shared/models/entity';
import { Channel, IGlobalQuest, QuestAction } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { Player } from '../../../shared/models';
import { ChatHelper } from './chat-helper';
import { SubscriptionManager } from './subscription-manager';
import { QuestHelper } from './quest-helper';

@Singleton
@AutoWired
export class GlobalQuestManager {

  @Inject private db: DatabaseManager;
  @Inject private subscriptionManager: SubscriptionManager;
  @Inject private chat: ChatHelper;
  @Inject private rng: RNGService;
  @Inject private questHelper: QuestHelper;

  private globalQuests: GlobalQuests;
  private questStats: { [key: string]: boolean };

  async init() {
    this.questStats = { };
    this.globalQuests = await this.db.loadGlobalQuests();
    if(!this.globalQuests) {
      this.globalQuests = new GlobalQuests();
    }

    this.globalQuests.init();
    this.subscribeToGQuestchanges();
    this.checkIfAnyQuestsValidAndAddNew();
    this.syncActiveQuestStats();
  }

  public tick() {
    this.globalQuests.globalQuests.forEach(gQuest => {
      if(this.isValidQuest(gQuest)) return;
      this.initateRemoveGQuest(gQuest);
    });

    this.checkIfAnyQuestsValidAndAddNew();
    this.save();
  }

  private syncActiveQuestStats() {
    this.questStats = { };

    this.globalQuests.globalQuests.forEach(gQuest => {
      if(!this.isValidQuest(gQuest)) return;

      gQuest.objectives.forEach(obj => this.questStats[obj.statistic] = true);
    });
  }

  private checkIfAnyQuestsValidAndAddNew() {
    if(!this.globalQuests.globalQuests.every(gQuest => this.isCompleteQuest(gQuest))) return;
    this.startGlobalQuest(this.questHelper.createGlobalQuest());
    this.syncActiveQuestStats();
    this.save();
  }

  public getGlobalQuest(questId: string): IGlobalQuest {
    return this.globalQuests.globalQuests.find(x => x.id === questId);
  }

  public isValidQuest(quest: IGlobalQuest): boolean {
    return quest.endsAt > Date.now();
  }

  public isCompleteQuest(quest: IGlobalQuest): boolean {
    return quest.objectives.every(obj => obj.progress >= obj.statisticValue);
  }

  public startGlobalQuest(gQuest: IGlobalQuest) {
    this.initiateAddGQuest(gQuest);

    this.chat.sendMessageFromClient({
      message: `A new global quest "${gQuest.name}" has started!`,
      playerName: '☆System'
    });
  }

  private subscribeToGQuestchanges() {
    this.subscriptionManager.subscribeToChannel(Channel.GlobalQuest, ({ quest, operation, doSave }) => {
      switch(operation) {
        case QuestAction.AddQuest: {
          this.addGQuest(quest);
          break;
        }
        case QuestAction.RemoveQuest: {
          this.removeGQuest(quest);
          break;
        }
        case QuestAction.QuestUpdate: {
          this.updateQuest(quest);
          break;
        }
      }

      if(doSave) {
        this.save();
      }
    });
  }

  public initiateAddGQuest(quest: IGlobalQuest) {
    if(!quest.id) quest.id = this.rng.id();
    this.subscriptionManager.emitToChannel(Channel.GlobalQuest, { quest, operation: QuestAction.AddQuest });
  }

  public initateRemoveGQuest(quest: IGlobalQuest) {
    this.subscriptionManager.emitToChannel(Channel.GlobalQuest, { quest, operation: QuestAction.RemoveQuest });
  }

  public initiateUpdateQuest(quest: IGlobalQuest, doSave?: boolean) {
    this.subscriptionManager.emitToChannel(Channel.GlobalQuest, { quest, operation: QuestAction.QuestUpdate, doSave });
  }

  private addGQuest(quest: IGlobalQuest) {
    this.globalQuests.addGlobalQuest(quest);
    this.save();
  }

  public removeGQuest(quest: IGlobalQuest) {
    this.globalQuests.removeGlobalQuest(quest.id);
    this.save();
  }

  public updateQuest(quest: IGlobalQuest) {
    const myQuest = this.getGlobalQuest(quest.id);
    if(!myQuest) return;

    extend(myQuest, quest);
  }

  public checkAndUpdateStats(player: Player, stat: string, val: number) {
    if(!this.questStats[stat]) return;

    this.globalQuests.globalQuests.forEach(gQuest => {
      if(!this.isValidQuest(gQuest)) return;

      let didUpdateQuest = false;

      gQuest.objectives.forEach(obj => {
        if(obj.statistic !== stat || obj.progress >= obj.statisticValue || player.map !== obj.requireMap) return;
        obj.progress += val;

        obj.contributions = obj.contributions || { };
        obj.contributions[player.name] = obj.contributions[player.name] || 0;
        obj.contributions[player.name] += val;

        didUpdateQuest = true;
      });

      if(didUpdateQuest) {
        this.initiateUpdateQuest(gQuest);
      }
    });
  }

  private save() {
    this.db.saveGlobalQuests(this.globalQuests);
  }

  public resetAllQuests() {
    this.globalQuests.globalQuests.forEach(gQuest => {
      this.initateRemoveGQuest(gQuest);
    });

    this.startGlobalQuest(this.questHelper.createGlobalQuest());
  }
}
