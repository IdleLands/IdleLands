
import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName } from '../../shared/interfaces';

export class SyncPlayersEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ChatPlayerListSync;
  description = 'Get all currently connected players.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    this.emit(ServerEventName.ChatPlayerListSync, this.game.playerManager.allSimplePlayers);
  }
}

export class ChatMessageEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ChatMessage;
  description = 'Send a chat message to the game.';
  args = 'message';

  async callback({ message } = { message: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    this.game.chatHelper.sendMessageFromClient({
      timestamp: Date.now(),
      message,

      playerName: `${player.name}${player.title ? `, the ${player.title}` : ''}`,
      playerLevel: player.level.total,
      playerAscension: player.ascensionLevel
    });
  }
}
