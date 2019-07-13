import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName, PermanentUpgrade } from '../../shared/interfaces';

export class PremiumUpgradeEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PremiumUpgrade;
  description = 'Buy a premium upgrade using ILP.';
  args = 'upgradeName';

  async callback({ upgradeName } = { upgradeName: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const didUpgrade = player.$premium.buyUpgrade(<PermanentUpgrade>upgradeName);
    if(!didUpgrade) return this.gameError('You do not have enough ILP to buy that upgrade.');

    player.syncPremium();

    this.gameMessage('Successfully upgraded yourself!');

    this.game.updatePlayer(player);
  }
}
