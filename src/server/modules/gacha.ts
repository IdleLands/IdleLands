import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName } from '../../shared/interfaces';

export class GateRollEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AstralGateRoll;
  description = 'Roll an Astral Gate event.';
  args = 'astralGateName';

  async callback({ astralGateName } = { astralGateName: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    this.game.updatePlayer(player);
  }
}
