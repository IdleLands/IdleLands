import { Event, EventType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat } from '../../../../shared/interfaces';

export class BlessXP extends Event {
  public static readonly WEIGHT = 100;

  public operateOn(player: Player) {
    // you can't gain more than 1% of your xp at once
    const baseXPGain = this.rng.numberInRange(10 + player.getStat(Stat.LUK), player.level.total * 25);
    const intermediateXPGain = Math.max(player.xp.maximum / 100, baseXPGain);
    const totalXPGain = player.gainXP(intermediateXPGain);

    const eventText = this.eventText(EventType.BlessXP, player, { xp: totalXPGain });
    const allText = `${eventText} [+${totalXPGain.toLocaleString()} xp]`;
    this.emitMessage([player], allText, AdventureLogEventType.XP);
  }
}
