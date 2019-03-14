import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { random, sample } from 'lodash';

import { AssetManager } from './asset-manager';
import { Item } from '../../../shared/models/entity';

@Singleton
@AutoWired
export class ItemGenerator {

  @Inject private assetManager: AssetManager;

  public generateNewbieItems(): Item[] {
    const itemNames = {
      body:     ['Tattered Shirt', 'Spray Tan', 'Temporary Tattoos', 'Hero\'s Tunic', 'Grandma\'s Sweater'],
      feet:     ['Cardboard Shoes', 'Wheelie Shoes', 'Sandals With Built-in Socks'],
      finger:   ['Twisted Wire', 'Candy Ring', 'Hero Academy Graduation Ring'],
      hands:    ['Pixelated Gloves', 'Winter Gloves', 'Mittens'],
      head:     ['Miniature Top Hat', 'Fruit Hat', 'Beanie', 'Sunglasses'],
      legs:     ['Leaf', 'Cargo Shorts', 'Comfy Shorts'],
      neck:     ['Old Brooch', 'Candy Necklace', 'Keyboard Cat Tie'],
      mainhand: ['Empty and Broken Ale Bottle', 'Father\'s Sword', 'Butter Knife', 'Hero\'s Axe', 'Chocolate Drumstick', 'Aged Toothbrush'],
      offhand:  ['Chunk of Rust', 'Shaking Fist', 'Upside-down Map', 'Sticker Book', 'Stolen Dagger'],
      charm:    ['Ancient Bracelet', 'Family Photo', 'Third Place Bowling Trophy', 'Love Letter']
    };

    const r = () => random(-1, 2);

    const equipment = [];

    Object.keys(itemNames).forEach(key => {
      const item = new Item();
      item.init({
        type: key,
        itemClass: 'newbie',
        name: sample(itemNames[key]),
        stats: { str: r(), con: r(), dex: r(), int: r(), agi: r(), luk: r(), xp: 2, gold: 1 }
      });

      equipment.push(item);
    });

    return equipment;
  }
}
