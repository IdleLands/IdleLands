import { Event, EventType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat } from '../../../../shared/interfaces';

export class Enchant extends Event {
  public static readonly WEIGHT = 3;

  public operateOn(player: Player) {
    const item = this.pickValidEnchantItem(player);
    if(!item) {
      this.emitMessage([player], 'The enchant fizzled.', AdventureLogEventType.Item);
      player.increaseStatistic(`Event.Enchant.Fail`, 1);
      return;
    }

    const choice = this.rng.chance.weighted([EventType.Tinker, EventType.Enchant], [0.15, 0.85]);
    const eventText = this.eventText(choice, player, { item: item.fullName() });

    let stat = this.pickStat();
    let boost = 25;

    if(choice === EventType.Tinker) {
      stat = this.pickTinkerStat();
      boost = stat === Stat.HP ? 200 : 2;
    }

    const baseNum = item.stats[stat] || 0;
    const allText = `${eventText} [${stat.toUpperCase()} ${baseNum.toLocaleString()} → ${(baseNum + boost).toLocaleString()}]`;

    item.enchantLevel = item.enchantLevel || 0;
    item.stats[stat] = item.stats[stat] || 0;

    item.enchantLevel++;
    item.stats[stat] += boost;
    item.recalculateScore();

    this.emitMessage([player], allText, AdventureLogEventType.Item);
  }
}
