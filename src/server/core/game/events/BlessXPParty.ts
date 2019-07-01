import { Event, EventMessageType, EventName } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat } from '../../../../shared/interfaces';

export class BlessXPParty extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player) {
    if(!player.$party) return;

    // you can't gain more than 5% of your xp at once
    const baseXPGain = this.rng.numberInRange(10 + player.getStat(Stat.LUK), player.level.total * 25);
    const intermediateXPGain = Math.min(player.xp.maximum / 20, baseXPGain);
    const totalXPGain = player.gainXP(intermediateXPGain);

    const eventText = this.eventText(EventMessageType.BlessXPParty, player, { xp: totalXPGain, partyName: player.$party.name });
    const allText = `${eventText} [+${totalXPGain.toLocaleString()} xp]`;

    (<any>player).$game.eventManager.emitStatGainsToPlayers(player.$party.members, { xp: totalXPGain });
    this.emitMessageToNames(player.$party.members, allText, AdventureLogEventType.XP);
  }
}
