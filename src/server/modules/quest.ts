import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName } from '../../shared/interfaces';

export class QuestReroll extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.QuestReroll;
  description = 'Reroll a quest for gold.';
  args = 'questId';

  async callback({ questId } = { questId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const cost = Math.floor(player.gold * 0.03);
    if(cost <= 0) return this.gameError('You do not have any money, somehow!');
    if(player.gold <= 100000) return this.gameError('You need at least 100k to reroll! Otherwise you\'re too poor for Kirierath.');

    const quest = player.$quests.rerollQuest(player, questId);
    if(!quest) return this.gameError('Quest does not exist to reroll.');

    player.spendGold(cost);

    this.gameMessage('Successfully rerolled quest!');

    this.game.updatePlayer(player);
  }
}

export class QuestCollect extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.QuestCollect;
  description = 'Collect quest rewards.';
  args = 'questId';

  async callback({ questId } = { questId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const rollRewards = player.$quests.completeQuest(player, questId);
    if(!rollRewards) return this.gameError('Could not complete quest.');

    this.emit(ServerEventName.QuestRewards, { rewards: rollRewards });

    this.gameMessage('Successfully collected quest rewards!');

    this.game.updatePlayer(player);
  }
}

export class GlobalQuestCollect extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GlobalQuestCollect;
  description = 'Collect global quest rewards.';
  args = 'questId';

  async callback({ questId } = { questId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const rollRewards = player.$quests.completeGlobalQuest(player, questId);
    if(!rollRewards) return this.gameError('Could not complete quest. You may have already collected rewards?');

    this.emit(ServerEventName.QuestRewards, { rewards: rollRewards });

    this.gameMessage('Successfully collected quest rewards!');

    this.game.updatePlayer(player);
  }
}
