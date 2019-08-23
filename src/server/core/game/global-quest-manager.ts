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
    this.subscriptionManager.subscribeToChannel(Channel.GlobalQuest, ({ quest, updates, operation, doSave }) => {
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
          if(updates) {
            this.updateQuestPatch(updates);
          } else {
            this.updateQuest(quest);
          }
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

  public initiateUpdateQuestPatch(updates: any[]) {
    this.subscriptionManager.emitToChannel(Channel.GlobalQuest, { operation: QuestAction.QuestUpdate, updates });
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

  public updateQuestPatch(patches: any[]) {
    patches.forEach(({ questIndex, objIndex, boost, from }) => {
      const obj = this.globalQuests.globalQuests[questIndex].objectives[objIndex];
      obj.progress += boost;

      obj.contributions = obj.contributions || { };
      obj.contributions[from] = obj.contributions[from] || 0;
      obj.contributions[from] += boost;
    });

    this.save();
  }

  public checkAndUpdateStats(player: Player, stat: string, val: number) {
    if(!this.questStats[stat]) return;

    const updates = [];

    this.globalQuests.globalQuests.forEach((gQuest, qIndex) => {
      if(!this.isValidQuest(gQuest)) return;

      gQuest.objectives.forEach((obj, index) => {
        if(obj.statistic !== stat || obj.progress >= obj.statisticValue || player.map !== obj.requireMap) return;
        updates.push({
          questIndex: qIndex,
          objIndex: index,
          boost: val,
          from: player.name
        });
      });

      if(updates.length > 0) {
        this.initiateUpdateQuestPatch(updates);
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
