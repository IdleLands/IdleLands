import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName, PermanentUpgrade, FestivalType, OtherILPPurchase } from '../../shared/interfaces';

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

export class PremiumFestivalEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PremiumFestival;
  description = 'Buy a premium festival using ILP.';
  args = 'festivalType, duration';

  async callback({ festivalType, duration } = { festivalType: '', duration: 0 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const didBuy = player.$premium.buyFestival(player, <FestivalType>festivalType, duration);
    if(!didBuy) return this.gameError('You do not have enough ILP to buy that festival, or you have one going already.');

    player.syncPremium();

    this.gameMessage('Successfully bought a festival!');

    this.game.updatePlayer(player);
  }
}

export class PremiumOtherEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PremiumOther;
  description = 'Buy an "other" premium item using ILP.';
  args = 'other';

  async callback({ other } = { other: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const didBuy = player.$premium.buyOther(player, <OtherILPPurchase>other);
    if(!didBuy) return this.gameError('You do not have enough ILP to buy that, or an error occurred.');

    player.syncPremium();

    this.gameMessage('Successfully bought that thing!');

    this.game.updatePlayer(player);
  }
}
