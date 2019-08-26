import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, Stat, EventMessageType } from '../../../../shared/interfaces';

export class Enchant extends Event {
  public static readonly WEIGHT = 3;

  public operateOn(player: Player) {
    const item = this.pickValidEnchantItem(player);
    if(!item) {
      this.emitMessage([player], 'You almost received an enchant, but it fizzled.', AdventureLogEventType.Item);
      player.increaseStatistic(`Event/Enchant/Fail`, 1);
      return;
    }

    const choice = this.rng.chance.weighted([EventMessageType.Tinker, EventMessageType.Enchant], [0.15, 0.85]);
    const eventText = this.eventText(choice, player, { item: item.fullName() });

    let stat = this.pickStat();
    let boost = Math.floor(item.baseScore * 0.05);

    if(choice === EventMessageType.Tinker) {
      stat = this.pickTinkerStat();
      boost = Math.floor(boost * (stat === Stat.HP ? 10 : 0.1));
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
