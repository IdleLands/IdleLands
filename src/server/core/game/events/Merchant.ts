import { Event, EventType } from './Event';
import { Player, Choice, Item } from '../../../../shared/models';
import { AdventureLogEventType, ServerEventName } from '../../../../shared/interfaces';

export class Merchant extends Event {
  public static readonly WEIGHT = 45;

  public static doChoice(player: Player, choice: Choice, valueChosen: string): boolean {
    const item = new Item();
    item.init(choice.extraData.item);

    const cost = choice.extraData.cost;

    switch(valueChosen) {
      case 'Yes': {
        if(player.gold < cost) return false;

        player.spendGold(cost);
        player.equip(item, false);
        return true;
      }

      case 'No': {
        return true;
      }

      case 'Compare': {
        player.emit(ServerEventName.ItemCompare, {
          choiceId: choice.id,
          newItem: item,
          currentItem: player.$inventory.itemInEquipmentSlot(item.type)
        });
        return false;
      }

      case 'Inventory': {
        if(player.gold < cost) return false;

        player.spendGold(cost);
        player.alwaysTryAddToInventory(item);
        return true;
      }
    }
  }

  public operateOn(player: Player) {
    const item = this.itemGenerator.generateItemForPlayer(player);

    const cost = item.score * 7;

    const choice = this.getChoice({
      desc: `
        Would you like to buy "${item.name}" (Score: ${item.score.toLocaleString()}, Type: ${item.type}) for ${cost.toLocaleString()} gold?
      `,
      choices: ['Yes', 'No', 'Compare', 'Inventory'],
      defaultChoice: 'Yes',
      extraData: {
        item,
        cost
      }
    });

    player.$choices.addChoice(player, choice);

    const eventText = this.eventText(EventType.Merchant, player, { item: item.fullName(), shopGold: cost });
    this.emitMessage([player], eventText, AdventureLogEventType.Item);
  }
}
