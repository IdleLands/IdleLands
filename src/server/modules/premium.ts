import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName, PermanentUpgrade, FestivalType, OtherILPPurchase, GoldGenderCost } from '../../shared/interfaces';

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

export class PremiumGenderBuy extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PremiumGoldGender;
  description = 'Buy a golden gender using gold.';
  args = 'gender';

  async callback({ gender } = { gender: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(!gender) return this.gameError('Gender does not exist.');

    const cost = GoldGenderCost[gender.split('-')[0]];
    if(!cost) return this.gameError('Gender does not have an associated cost.');

    if(player.$achievements.hasBoughtGender(gender)) return this.gameError('That gender has already been purchased!');

    const hasGold = player.gold > cost;
    if(!hasGold) return this.gameError('You do not have enough ILP to buy that, or an error occurred.');

    player.$achievements.buyGender(gender);
    player.spendGold(cost);

    this.gameMessage('Successfully bought that gender! Shiny!');

    this.game.updatePlayer(player);
  }
}
