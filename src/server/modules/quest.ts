import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName } from '../../shared/interfaces';

export class QuestReroll extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.QuestReroll;
  description = 'Reroll a quest for gold.';
  args = 'questId';

  async callback({ questId } = { questId: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const cost = 50000;
    if(player.gold < cost) return this.gameError('You do not have 50,000 gold!');

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
