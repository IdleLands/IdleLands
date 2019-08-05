import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName, ModeratorTier } from '../../shared/interfaces';

export class GMMotdEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMSetMOTD;
  description = 'GM: Set the MOTD for the game';
  args = 'motd';

  async callback({ motd } = { motd: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    this.game.gmHelper.initiateSetMOTD(motd);
  }
}

export class GMToggleMuteEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMToggleMute;
  description = 'GM: Toggle mute for a player';
  args = 'playerName, duration';

  async callback({ playerName, duration } = { playerName: '', duration: 60 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.modTier < ModeratorTier.ChatMod) return this.gameError('Lol no.');

    this.game.gmHelper.initiateMute(playerName, duration);

  }
}

export class GMChangeModTierEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMChangeModTier;
  description = 'GM: Change mod tier for a player';
  args = 'playerName, newTier';

  async callback({ playerName, newTier } = { playerName: '', newTier: 0 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.modTier < ModeratorTier.Admin) return this.gameError('Lol no.');

    this.game.gmHelper.initiateChangeModTier(playerName, newTier);

  }
}

export class GMStartFestivalEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMStartFestival;
  description = 'GM: Start a festival';
  args = 'festival';

  async callback({ festival } = { festival: null }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    if(!festival) return this.gameError('No festival specified.');

    this.game.festivalManager.startGMFestival(player, festival);

  }
}
