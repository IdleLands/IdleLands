import { Event, EventType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

export class Switcheroo extends Event {
  public static readonly WEIGHT = 1;

  public operateOn(player: Player) {
    const stat = this.pickStat();
    const item = this.pickValidItem(player);
    if(!item || !item.stats[stat]) {
      player.increaseStatistic(`Event/Switcheroo/Fail`, 1);
      return;
    }

    const eventText = this.eventText(EventType.Switcheroo, player, { item: item.fullName(), stat });
    const allText = `${eventText} [${stat.toUpperCase()} ${item.stats[stat]} → ${-item.stats[stat]}]`;

    item.stats[stat] = -item.stats[stat];
    item.recalculateScore();

    this.emitMessage([player], allText, AdventureLogEventType.Item);
  }
}
