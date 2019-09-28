import { Event } from './Event';
import { Player, Choice, Item } from '../../../../shared/models';
import { AdventureLogEventType, ServerEventName, Stat, EventMessageType, IChoice, IPet } from '../../../../shared/interfaces';

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
    const item: Item = opts.item || this.itemGenerator.generateItemForPlayer(player);
    if(!item || item.score === 0) {
      player.increaseStatistic(`Event/FindItem/Nothing`, 1);
      return;
    }

    if(opts.item) {
      const existingChoices = Object.values(player.$choicesData.choices);
      const hasMatchingItem = existingChoices.some((x: IChoice) => {
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

    const autoEquipPersonalities = [
      { name: 'Strong',       stat: Stat.STR },
      { name: 'Intelligent',  stat: Stat.INT },
      { name: 'Fortuitous',   stat: Stat.CON },
      { name: 'Dextrous',     stat: Stat.DEX },
      { name: 'Agile',        stat: Stat.AGI },
      { name: 'Lucky',        stat: Stat.LUK }
    ];

    let didPetAutoEquip = false;

    if(player.$personalities.isActive('HorseArmorer')) {
      Object.values(player.$petsData.allPets).forEach((pet: IPet) => {
        if(didPetAutoEquip) return;

        didPetAutoEquip = pet.tryEquipAnItemAndReplaceSlotsIfPossible(item);
      });
    }

    if(didPetAutoEquip) {
      this.emitMessage([player],
        this._parseText(`%player found %item and gave it to one of %hisher pets!`, player, { item: item.fullName() }),
      AdventureLogEventType.Item);
    }

    const didAutoEquip = autoEquipPersonalities.some(({ name, stat }) => {
      if(!player.$personalities.isActive(name)) return false;

      const currentItem = player.$inventory.itemInEquipmentSlot(item.type);

      if(!currentItem) return true;

      if(!item.stats[stat]) return false;
      if(item.stats[stat] <= currentItem.stats[stat]) return false;

      return true;
    });

    if(didAutoEquip) {
      this.doChoice(player.$$game.eventManager, player, choice, 'Yes');
    } else {
      player.$choices.addChoice(player, choice);
    }

    const chestText = opts.fromChest
      ? this._parseText(`%player found %item in a treasure chest!`, player, { item: item.fullName() })
      : '';

    const guildText = opts.fromGuild
      ? this._parseText(`%player found %item via the guild generator!`, player, { item: item.fullName() })
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
                   || guildText
                   || guardianText
                   || pillageText
                   || petText
                   || this.eventText(EventMessageType.FindItem, player, { item: item.fullName() });

    this.emitMessage([player], eventText, AdventureLogEventType.Item);
  }
}
