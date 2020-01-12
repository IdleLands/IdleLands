
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

    // only non-mods can be muted
    if(!player.modTier) {

      // if they're currently muted
      if(player.mutedUntil > Date.now()) {
        return this.gameError(`You're muted, friendo. Come back at ${new Date(player.mutedUntil).toLocaleString()}`);
      }

      // reset it
      if(player.mutedUntil) {
        player.messageCooldown = 0;
        player.mutedUntil = 0;
      }

      // if player has a last message sent
      if(player.lastMessageSent) {

        // and they just sent one 500ms or less from the last one, increase their cooldown
        if(player.lastMessageSent + 500 > Date.now()) {
          player.messageCooldown = player.messageCooldown || 0;
          player.messageCooldown++;

        // otherwise, lower their cooldown
        } else {
          player.messageCooldown = player.messageCooldown || 0;
          player.messageCooldown = Math.max(player.messageCooldown, 0);
        }
      }

      // reset message sent time
      player.lastMessageSent = Date.now();

      // if they have more than 3 strikes, they're out
      if(player.messageCooldown > 3) {
        player.mutedUntil = Date.now() + 1000 * 60 * 15;
      }
    }

    message = message.slice(0, 500);

    const playerGuild = this.game.guildManager.getGuild(player.guildName);
    this.game.chatHelper.sendMessageFromClient({
      timestamp: Date.now(),
      message,
      guildTag: playerGuild ? playerGuild.tag : '',
      realPlayerName: player.name,
      playerName: `${player.name}${player.title ? `, the ${player.title}` : ''}`,
      playerLevel: player.level.total,
      playerAscension: player.ascensionLevel,
      address: player.ip
    });
  }
}
