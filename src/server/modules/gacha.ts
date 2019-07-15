import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName } from '../../shared/interfaces';

export class GateRollEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AstralGateRoll;
  description = 'Roll an Astral Gate event.';
  args = 'astralGateName, numRolls';

  async callback({ astralGateName, numRolls } = { astralGateName: '', numRolls: 0 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(numRolls !== 1 && numRolls !== 10) return this.gameError('Invalid number of rolls specified.');

    const rollRewards = player.$premium.doGachaRoll(player, astralGateName, numRolls);
    if(!rollRewards) return this.gameError('You do not have enough currency to do that roll!');

    console.log(rollRewards);

    this.game.updatePlayer(player);
  }
}
