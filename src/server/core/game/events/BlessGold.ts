import { Event, EventType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat } from '../../../../shared/interfaces';

export class BlessGold extends Event {
  public static readonly WEIGHT = 100;

  public operateOn(player: Player) {
    const goldGain = this.rng.chance.numberInRange(10 + player.getStat(Stat.LUK), player.level.total * 25);
    const totalGoldGain = player.gainGold(goldGain);

    const eventText = this.eventText(EventType.BlessGold, player, { gold: totalGoldGain });
    const allText = `${eventText} [+${totalGoldGain.toLocaleString()} gold]`;
    this.emitMessage([player], allText, AdventureLogEventType.Gold);
  }
}
