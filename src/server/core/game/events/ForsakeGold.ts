import { Event, EventMessageType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat } from '../../../../shared/interfaces';

export class ForsakeGold extends Event {
  public static readonly WEIGHT = 50;

  public operateOn(player: Player) {
    const baseGoldLoss = this.rng.numberInRange(10, player.level.total * 50) - player.getStat(Stat.LUK);

    // you always lose at least 1
    const goldLoss = Math.min(-1, -baseGoldLoss);
    const totalGoldLoss = player.gainGold(goldLoss);

    const eventText = this.eventText(EventMessageType.ForsakeGold, player, { gold: Math.abs(totalGoldLoss) });
    const allText = `${eventText} [${totalGoldLoss.toLocaleString()} gold]`;
    this.emitMessage([player], allText, AdventureLogEventType.Gold);
  }
}
