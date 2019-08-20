import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { random, sample, get, zip, extend } from 'lodash';

import { AssetManager } from './asset-manager';
import { Item, Player } from '../../../shared/models';
import { ItemClass, ItemSlot, AllStats, GenerateableItemSlot, Stat } from '../../../shared/interfaces';
import { RNGService } from './rng-service';
import { Logger } from '../logger';

@Singleton
@AutoWired
export class ItemGenerator {

  @Inject private logger: Logger;
  @Inject private assetManager: AssetManager;
  @Inject private rng: RNGService;

  private prefixWeight = {
    [ItemClass.Newbie]: [
      [2, 10],
      [1, 100],
      [0, 10000]
    ],
    [ItemClass.Basic]: [
      [2, 20],
      [1, 500],
      [0, 9000]
    ],
    [ItemClass.Pro]: [
      [3, 1],
      [2, 30],
      [1, 600],
      [0, 8000]
    ],
    [ItemClass.Idle]: [
      [3, 10],
      [2, 100],
      [1, 7000],
      [0, 5000]
    ],
    [ItemClass.Godly]: [
      [3, 20],
      [2, 200],
      [1, 6000],
      [0, 3000]
    ],
    [ItemClass.Goatly]: [
      [4, 1],
      [3, 50],
      [2, 1000],
      [1, 6000],
      [0, 3000]
    ],
    [ItemClass.Omega]: [
      [5, 1],
      [4, 10],
      [3, 100],
      [2, 5000],
      [1, 1000],
      [0, 500]
    ]
  };

  private suffixWeight = {
    [ItemClass.Newbie]: [
      [1, 100],
      [0, 10000]
    ],
    [ItemClass.Basic]: [
      [1, 1000],
      [0, 10000]
    ],
    [ItemClass.Pro]: [
      [1, 500],
      [0, 500]
    ],
    [ItemClass.Idle]: [
      [2, 10],
      [1, 10000],
      [0, 5000]
    ],
    [ItemClass.Godly]: [
      [2, 20],
      [1, 10000],
      [0, 3000]
    ],
    [ItemClass.Goatly]: [
      [2, 30],
      [1, 10000],
      [0, 1000]
    ],
    [ItemClass.Omega]: [
      [3, 1],
      [2, 20],
      [1, 10000],
      [0, 3000]
    ]
  };

  private assetTiers = {
    [ItemClass.Newbie]: 0,
    [ItemClass.Basic]: 150,
    [ItemClass.Pro]: 500,
    [ItemClass.Idle]: 1000,
    [ItemClass.Godly]: 5000,
    [ItemClass.Goatly]: 50000,
    [ItemClass.Omega]: 100000
  };

  private levelTiers = [
    { itemClass: ItemClass.Basic,   levelReq: 10 },
    { itemClass: ItemClass.Pro,     levelReq: 50 },
    { itemClass: ItemClass.Idle,    levelReq: 100 },
    { itemClass: ItemClass.Godly,   levelReq: 500 },
    { itemClass: ItemClass.Goatly,  levelReq: 1000 },
    { itemClass: ItemClass.Omega,   levelReq: 5000 }
  ];

  private allAssetScoreSorted: { [key in ItemSlot | 'prefix' | 'suffix']?: { [key2 in ItemClass]: any[] } } = {};

  public async init() {
    const relevantItemTypes = [
      'body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'mainhand', 'neck', 'offhand',
      'prefix', 'suffix'
    ];

    relevantItemTypes.forEach(type => {
      this.assetManager.allObjectAssets[type].forEach(asset => this.sortAssetInScore(asset));
    });
  }

  private determineTierOfItemForScore(score: number): ItemClass {
    const allClasses = [
      ItemClass.Omega, ItemClass.Goatly, ItemClass.Godly,
      ItemClass.Idle, ItemClass.Pro, ItemClass.Basic, ItemClass.Newbie
    ];

    for(let i = 0; i < allClasses.length; i++) {
      if(score > this.assetTiers[allClasses[i]]) return allClasses[i];
    }

    return ItemClass.Newbie;
  }

  private sortAssetInScore(asset: any) {
    this.allAssetScoreSorted[asset.type] = this.allAssetScoreSorted[asset.type] || {};
    const assetScore = Item.calcScoreForHash(asset);
    const tier = this.determineTierOfItemForScore(assetScore);

    this.allAssetScoreSorted[asset.type][tier] = this.allAssetScoreSorted[asset.type][tier] || [];
    this.allAssetScoreSorted[asset.type][tier].push(asset);
  }

  private getAssetScoreSeries(scoreCat: ItemSlot, scoreTier: ItemClass) {
    return get(this.allAssetScoreSorted, [scoreCat, scoreTier], []);
  }

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
        type: <ItemSlot>key,
        itemClass: ItemClass.Newbie,
        name: sample(itemNames[key]),
        stats: { str: r(), con: r(), dex: r(), int: r(), agi: r(), luk: r(), xp: 2, gold: 1 }
      });

      equipment.push(item);
    });

    return equipment;
  }

  public generateGuardianItem(player: Player, proto: any): Item {
    const item = new Item();

    const stats = {};
    Object.values(Stat).forEach(stat => {
      if(!proto.stats[stat]) return;
      stats[stat] = proto.stats[stat];
    });

    item.init({
      name: proto.name,
      type: proto.type,
      itemClass: ItemClass.Guardian,
      stats,
      enchantLevel: proto.enchantLevel || 0
    });

    return item;
  }

  public generateItemForPlayer(
    player: Player,
    opts?: { forceType?: string, allowNegative?: boolean, qualityBoost?: number, generateLevel?: number, forceClass?: ItemClass }
  ): Item {
    opts = extend({}, { forceType: '', allowNegative: false, qualityBoost: 0, generateLevel: player.level.total, forceClass: '' }, opts);
    return this.generateItem(opts);
  }

  public generateItem(
    opts?: { forceType?: string, allowNegative?: boolean, qualityBoost?: number, generateLevel?: number, forceClass?: ItemClass }
  ): Item {

    opts = extend({}, { forceType: '', allowNegative: false, qualityBoost: 0, generateLevel: 1, forceClass: '' }, opts);

    if(!opts.generateLevel) opts.generateLevel = 0;

    if(!opts.forceType) opts.forceType = this.rng.pickone(GenerateableItemSlot);
    opts.forceType = opts.forceType.toLowerCase();

    const item = new Item();

    const curLevel = opts.generateLevel;
    const possibleItemClasses = [ItemClass.Newbie];

    // determine the item tier we want to generate
    this.levelTiers.forEach(({ itemClass, levelReq }) => {
      if(curLevel < levelReq) return;
      possibleItemClasses.push(itemClass);
    });

    // force boost quality if possible
    for(let i = 0; i < opts.qualityBoost; i++) {
      if(possibleItemClasses.length <= 1) continue;
      possibleItemClasses.shift();
    }

    const itemClassChosen = opts.forceClass || this.rng.pickone(possibleItemClasses);

    let name = '';
    const allStatAssets = [];

    const baseAsset = this.rng.pickone(this.getAssetScoreSeries(<ItemSlot>opts.forceType, itemClassChosen));
    if(!baseAsset) {
      const itemRef = new Item();
      itemRef.init({
        name: 'Unfortunately Poorly Generated Item',
        type: <ItemSlot>opts.forceType,
        stats: { luk: -1 },
        itemClass: ItemClass.Newbie
      });

      return itemRef;
    }

    name = baseAsset.name;
    allStatAssets.push(baseAsset);

    const prefixCount = this.rng.chance.weighted(...zip(...this.prefixWeight[itemClassChosen]));
    const suffixCount = this.rng.chance.weighted(...zip(...this.suffixWeight[itemClassChosen]));

    for(let p = 0; p < prefixCount; p++) {
      const prefix = this.rng.pickone(this.allAssetScoreSorted.prefix[itemClassChosen]);
      if(!prefix) continue;

      name = `${prefix.name} ${name}`;
      allStatAssets.push(prefix);
    }

    for(let s = 0; s < suffixCount; s++) {
      const suffix = this.rng.pickone(this.allAssetScoreSorted.suffix[itemClassChosen]);
      if(!suffix) continue;

      name = `${name} ${s > 0 ? 'and the ' + suffix.name : 'of the ' + suffix.name}`;
      allStatAssets.push(suffix);
    }

    const allStats = allStatAssets.reduce((prev, cur) => {
      AllStats.forEach(stat => {
        if(!cur[stat]) return;
        prev[stat] = prev[stat] || 0;
        prev[stat] += cur[stat];
      });

      return prev;
    }, {});

    const calcItemClass = this.determineTierOfItemForScore(Item.calcScoreForHash(allStats));

    item.init({ name, type: <ItemSlot>opts.forceType, stats: allStats, itemClass: calcItemClass });

    if(item.score <= 0 && !opts.allowNegative) return null;

    return item;
  }
}
