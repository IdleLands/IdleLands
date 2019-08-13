import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat, EventMessageType } from '../../../../shared/interfaces';

export class BlessGoldParty extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player) {
    if(!player.$party) return;

    const goldGain = this.rng.numberInRange(10 + player.getStat(Stat.LUK), player.level.total * 25);
    const totalGoldGain = player.gainGold(goldGain);

    const eventText = this.eventText(EventMessageType.BlessGoldParty, player, { gold: totalGoldGain, partyName: player.$party.name });
    const allText = `${eventText} [+${totalGoldGain.toLocaleString()} gold]`;

    player.$$game.eventManager.emitStatGainsToPlayers(player.$party.members, { gold: totalGoldGain });
    this.emitMessage([player], allText, AdventureLogEventType.Gold);
  }
}
