import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName, PetUpgrade } from '../../shared/interfaces';


export class PetOOCAbilityEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetOOCAction;
  description = 'Execute your pets OOC action.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.stamina.total < player.$pets.$activePet.$attribute.oocAbilityCost) return this.gameError('You do not have enough stamina!');

    const msg = player.petOOCAction();
    this.gameMessage(msg);

    this.game.updatePlayer(player);
  }
}

export class PetUpgradeEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PetUpgrade;
  description = 'Upgrade one of your pets qualities.';
  args = 'petUpgrade';

  async callback({ petUpgrade } = { petUpgrade: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const upgrade = player.$pets.$activePet.nextUpgrade[petUpgrade];
    if(!upgrade) return this.gameError('That upgrade level does not exist!');
    if(player.gold < upgrade.c) return this.gameError('You do not have enough gold to do that upgrade!');
    if(upgrade.a && player.$pets.$activePet.rating < upgrade.a) return this.gameError('Your pet is not ascended enough for that upgrade!');

    player.$pets.upgradePet(player, <PetUpgrade>petUpgrade);
    this.gameMessage('Upgraded your pet!');

    this.game.updatePlayer(player);
  }
}
