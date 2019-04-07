

import { ServerEventName, ServerEvent, ItemSlot } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class TogglePersonalityEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.TogglePersonality;
  description = 'Toggle a personality.';
  args = 'personalityName';

  async callback({ personalityName } = { personalityName: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const didSucceed = player.togglePersonality(personalityName);
    if(!didSucceed) return this.gameError('You are unable to toggle that personality.');

    this.game.updatePlayer(player);
    this.gameSuccess(`Toggled personality "${personalityName}"!`);
  }
}
