import { Event, EventMessageType, EventName } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat } from '../../../../shared/interfaces';

export class BlessGold extends Event {
  public static readonly WEIGHT = 100;

  public operateOn(player: Player) {

    if(player.$party && this.rng.likelihood(25)) {
      player.$$game.eventManager.doEventFor(player, EventName.BlessGoldParty);
      return;
    }

    const goldGain = this.rng.numberInRange(10 + player.getStat(Stat.LUK), player.level.total * 25);
    const totalGoldGain = player.gainGold(goldGain);

    const eventText = this.eventText(EventMessageType.BlessGold, player, { gold: totalGoldGain });
    const allText = `${eventText} [+${totalGoldGain.toLocaleString()} gold]`;
    this.emitMessage([player], allText, AdventureLogEventType.Gold);
  }
}
