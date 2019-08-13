import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat, EventMessageType } from '../../../../shared/interfaces';

export class ForsakeXP extends Event {
  public static readonly WEIGHT = 50;

  public operateOn(player: Player) {
    // you can't lose more than 10% of your xp at once
    const baseXPLoss = this.rng.numberInRange(10, player.level.total * 50) - player.getStat(Stat.LUK);

    const intermediateXPLoss = -Math.min(player.xp.maximum / 10, baseXPLoss);
    const totalXPLoss = player.gainXP(intermediateXPLoss);

    const eventText = this.eventText(EventMessageType.ForsakeXP, player, { xp: Math.abs(totalXPLoss) });
    const allText = `${eventText} [${totalXPLoss.toLocaleString()} xp]`;
    this.emitMessage([player], allText, AdventureLogEventType.XP);
  }
}
