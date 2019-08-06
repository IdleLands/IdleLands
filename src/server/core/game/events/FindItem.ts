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

  public operateOn(player: Player, opts: any = { item: null, fromPet: false, fromGuardian: false, fromPillage: false, fromChest: false }) {
    const item = opts.item || this.itemGenerator.generateItemForPlayer(player);
    if(!item) {
      player.increaseStatistic(`Event/FindItem/Nothing`, 1);
      return;
    }

    if(opts.item) {
      const existingChoices = player.$choicesData.choices;
      const hasMatchingItem = existingChoices.some(x => {
        if(!x.extraData || !x.extraData.item) return;
        return x.extraData.item.name === opts.item.name;
      });

      if(hasMatchingItem) {
        player.increaseStatistic(`Event/FindItem/Duplicate`, 1);
        return;
      }
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

    const chestText = opts.fromChest
      ? this._parseText(`%player found %item on in a treasure chest!`, player, { item: item.fullName() })
      : '';

    const guardianText = opts.fromGuardian
      ? this._parseText(`%player found %item on the carcass of a Realm Guardian!`, player, { item: item.fullName() })
      : '';

    const pillageText = opts.fromPillage
      ? this._parseText(`%player pillaged %item from a nearby town!`, player, { item: item.fullName() })
      : '';

    const petText = opts.fromPet
      ? this._parseText(`${player.$pets.$activePet.name} found %item while digging around!`, player, { item: item.fullName() })
      : '';

    const eventText = chestText
                   || guardianText
                   || pillageText
                   || petText
                   || this.eventText(EventMessageType.FindItem, player, { item: item.fullName() });

    this.emitMessage([player], eventText, AdventureLogEventType.Item);
  }
}
