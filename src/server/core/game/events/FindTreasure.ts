import { Event, EventName } from './Event';
import { Player } from '../../../../shared/models/entity';
import { Item } from '../../../../shared/models';
import { ItemClass } from '../../../../shared/interfaces';

export class FindTreasure extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player, opts: any = { treasureName: '' }) {

    const { chests, items } = this.assetManager.allTreasureAssets;

    player.increaseStatistic('Treasure/Total/Touch', 1);
    player.increaseStatistic(`Treasure/Chest/${opts.treasureName}`, 1);

    const treasureItems = chests[opts.treasureName].items;
    const allItemInstances = treasureItems.map(itemName => {
      const item = new Item();
      const baseItem = items[itemName];
      baseItem.name = itemName;
      baseItem.itemClass = ItemClass.Guardian;
      item.init(baseItem);
      return item;
    });

    allItemInstances.forEach(item => {
      player.increaseStatistic('Treasure/Total/ItemsFound', 1);
      player.$$game.eventManager.doEventFor(player, EventName.FindItem, { fromChest: true, item: item });
    });
  }
}
