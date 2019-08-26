import { Event } from './Event';
import { Player, Choice, Item } from '../../../../shared/models';
import { AdventureLogEventType, ServerEventName, EventName, EventMessageType } from '../../../../shared/interfaces';

export class Merchant extends Event {
  public static readonly WEIGHT = 45;

  public doChoice(eventManager: any, player: Player, choice: Choice, valueChosen: string): boolean {
    const item = new Item();
    item.init(choice.extraData.item);

    const isEnchant = choice.extraData.item.type === 'enchant';
    const cost = choice.extraData.cost;

    switch(valueChosen) {
      case 'Yes': {
        if(player.gold < cost) {
          eventManager.errorMessage(player, 'You cannot currently afford this.');
          return false;
        }

        player.spendGold(cost);

        if(isEnchant) {
          player.increaseStatistic(`Event/Enchant/Buy`, 1);
          eventManager.doEventFor(player, EventName.Enchant);
          eventManager.successMessage(player, `You bought an enchantment.`);

        } else {
          player.equip(item, false);
          eventManager.successMessage(player, `You bought "${item.name}" and equipped it.`);
        }

        return true;
      }

      case 'No': {
        return true;
      }

      case 'Compare': {
        if(isEnchant) {
          eventManager.errorMessage(player, 'Cannot compare with an enchantment. Stop hacking.');
          return false;
        }

        player.emit(ServerEventName.ItemCompare, {
          choiceId: choice.id,
          newItem: item,
          currentItem: player.$inventory.itemInEquipmentSlot(item.type)
        });

        return false;
      }

      case 'Inventory': {
        if(player.gold < cost || isEnchant) {
          eventManager.errorMessage(player, 'You cannot currently afford this.');
          return false;
        }

        player.spendGold(cost);
        player.alwaysTryAddToInventory(item);
        eventManager.successMessage(player, `You bought "${item.name}" and sent it to your inventory.`);

        return true;
      }
    }
  }

  public operateOn(player: Player, opts: { merchantBonus }) {
    const bonus = +opts.merchantBonus || 0;

    let item = null;
    let cost = 0;
    let choices = ['Yes', 'No'];
    let pickableChoices = ['Yes', 'No'];

    if(this.rng.likelihood(10)) {
      player.increaseStatistic(`Event/Merchant/Enchant`, 1);
      item = { name: 'Enchantment', score: 1, type: 'enchant', fullName: () => 'enchantment' };

      const baseCostFivePercent = Math.floor(player.$inventory.totalItemScore() * 0.05);
      cost = this.rng.numberInRange(baseCostFivePercent * 2, baseCostFivePercent * 3);

    } else {
      player.increaseStatistic(`Event/Merchant/Item`, 1);
      choices = ['Yes', 'No', 'Compare', 'Inventory'];
      pickableChoices = ['Yes', 'No', 'Inventory'];
      item = this.itemGenerator.generateItemForPlayer(player, { qualityBoost: 1, generateLevel: player.level.total + bonus });
      if(!item) {
        player.increaseStatistic(`Event/Merchant/Nothing`, 1);
        return;
      }

      cost = item.score * 7 + (bonus * 1000);
    }

    const choice = this.getChoice({
      desc: `
        Would you like to buy "${item.name}" (Score: ${item.score.toLocaleString()}, Type: ${item.type}) for ${cost.toLocaleString()} gold?
      `,
      choices,
      defaultChoice: player.getDefaultChoice(pickableChoices),
      extraData: {
        item,
        cost
      }
    });

    player.$choices.addChoice(player, choice);

    const eventText = this.eventText(EventMessageType.Merchant, player, { item: item.fullName(), shopGold: cost });
    this.emitMessage([player], eventText, AdventureLogEventType.Item);
  }
}
