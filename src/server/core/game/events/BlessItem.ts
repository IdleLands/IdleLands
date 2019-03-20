import { Event, EventType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

export class BlessItem extends Event {
  public static readonly WEIGHT = 150;

  public operateOn(player: Player) {
    const stat = this.pickStat();
    const item = this.pickValidBlessItem(player);
    if(!item) {
      player.$statistics.increase(`Event.BlessItem.Fail`, 1);
      return;
    }

    // boost item stat by 5% or 5, whichever is valid
    const boost = item.stats[stat] === 0 ? 5 : Math.max(3, Math.abs(Math.floor(item.stats[stat] / 20)));
    const eventText = this.eventText(EventType.BlessItem, player, { item: item.fullName() });
    const allText = `${eventText} [${stat} ${item.stats[stat].toLocaleString()} -> ${(item.stats[stat] + boost).toLocaleString()}]`;

    item.stats[stat] += boost;
    item.recalculateScore();

    this.emitMessage([player], allText, AdventureLogEventType.Item);
  }
}
