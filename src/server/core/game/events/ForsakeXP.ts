import { Event, EventType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat } from '../../../../shared/interfaces';

export class ForsakeXP extends Event {
  public static readonly WEIGHT = 50;

  public operateOn(player: Player) {
    // you can't lose more than 2% of your xp at once
    const baseXPLoss = this.rng.numberInRange(10, player.level.total * 50) - player.getStat(Stat.LUK);

    const intermediateXPLoss = -Math.max(player.xp.maximum / 50, baseXPLoss);
    const totalXPLoss = player.gainXP(intermediateXPLoss);

    const eventText = this.eventText(EventType.ForsakeXP, player, { xp: totalXPLoss });
    const allText = `${eventText} [${totalXPLoss.toLocaleString()} xp]`;
    this.emitMessage([player], allText, AdventureLogEventType.XP);
  }
}
