import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, EventMessageType } from '../../../../shared/interfaces';

export class BlessItem extends Event {
  public static readonly WEIGHT = 150;

  public operateOn(player: Player) {
    const stat = this.pickStat();
    const item = this.pickValidBlessItem(player);
    if(!item) {
      player.increaseStatistic(`Event/BlessItem/Fail`, 1);
      return;
    }

    item.stats[stat] = item.stats[stat] || 0;

    // boost item stat by 5% or 5, whichever is valid
    const boost = item.stats[stat] === 0 ? 5 : Math.max(3, Math.abs(Math.floor(item.stats[stat] / 20)));
    const eventText = this.eventText(EventMessageType.BlessItem, player, { item: item.fullName() });

    const baseNum = item.stats[stat];
    const allText = `${eventText} [${stat.toUpperCase()} ${baseNum.toLocaleString()} → ${(baseNum + boost).toLocaleString()}]`;

    item.stats[stat] += boost;
    item.recalculateScore();

    this.emitMessage([player], allText, AdventureLogEventType.Item);
  }
}
