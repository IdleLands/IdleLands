import { Event, EventMessageType } from './Event';
import { Player, Choice, Item } from '../../../../shared/models';
import { AdventureLogEventType, ServerEventName } from '../../../../shared/interfaces';

export class FindItem extends Event {
  public static readonly WEIGHT = 30;

  public doChoice(eventManager: any, player: Player, choice: Choice, valueChosen: string): boolean {
    const item = new Item();
    item.init(choice.extraData.item);

    switch(valueChosen) {
      case 'Yes': {
        player.equip(item, false);
        eventManager.successMessage(player, `You equipped the "${item.fullName()}" successfully.`);
        return true;
      }

      case 'No': {
        player.alwaysTryAddToInventory(item);
        eventManager.successMessage(player, `You sent the "${item.fullName()}" to your inventory.`);
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

      case 'Sell': {
        const value = player.sellItem(item);
        eventManager.successMessage(player, `You sold the "${item.fullName()}" for ${value.toLocaleString()} gold.`);
        return true;
      }
    }
  }

  public operateOn(player: Player, opts?: { item: Item, fromPet: boolean }) {
    const item = (opts && opts.item) ? opts.item : this.itemGenerator.generateItemForPlayer(player);
    if(!item) {
      player.increaseStatistic(`Event/FindItem/Nothing`, 1);
      return;
    }

    const choice = this.getChoice({
      desc: `Would you like to equip "${item.name}" (Score: ${item.score.toLocaleString()}, Type: ${item.type})?`,
      choices: ['Yes', 'No', 'Compare', 'Sell'],
      defaultChoice: player.getDefaultChoice(['Yes', 'No', 'Sell']),
      extraData: {
        item
      }
    });

    player.$choices.addChoice(player, choice);

    const petText = opts && opts.fromPet
      ? this._parseText(`${player.$pets.$activePet.name} found %item while digging around!`, player, { item: item.fullName() })
      : '';
    const eventText = petText || this.eventText(EventMessageType.FindItem, player, { item: item.fullName() });
    this.emitMessage([player], eventText, AdventureLogEventType.Item);
  }
}
