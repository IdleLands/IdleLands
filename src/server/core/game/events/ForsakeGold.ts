import { Event, EventType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat } from '../../../../shared/interfaces';

export class ForsakeGold extends Event {
  public static readonly WEIGHT = 5;

  public operateOn(player: Player) {
    const baseGoldLoss = this.rng.chance.integer({ min: 10, max: player.level.total * 50 }) + player.getStat(Stat.XP);

    // you always lose at least 1
    const goldLoss = Math.max(-1, baseGoldLoss);
    const totalGoldLoss = player.gainGold(-goldLoss);

    const eventText = this.eventText(EventType.ForsakeGold, player, { gold: Math.abs(totalGoldLoss) });
    const allText = `${eventText} [${totalGoldLoss.toLocaleString()} gold]`;
    this.emitMessage([player], allText, AdventureLogEventType.Gold);
  }
}
