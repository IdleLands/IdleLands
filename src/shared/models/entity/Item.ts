
import { extend } from 'lodash';
import * as uuid from 'uuid/v4';
import { nonenumerable } from 'nonenumerable';

import { Player } from './Player';
import { IItem, ItemClass, ItemSlot, Stat } from '../../interfaces';

const MAX_DIFF_PERCENT = 3; // 300, but 3 is the divisor
const MAX_ENCHANT_LEVEL = 10;

const woodValues = {
  [Stat.HP]: 100,

  [Stat.STR]: 5,
  [Stat.DEX]: 10,
  [Stat.AGI]: 10
};

const clayValues = {
  [Stat.HP]: 100,

  [Stat.INT]: 5,
  [Stat.DEX]: 10,
  [Stat.AGI]: 10
};

const stoneValues = {
  [Stat.HP]: 100,

  [Stat.CON]: 5,
  [Stat.DEX]: 10,
  [Stat.AGI]: 10
};

const astraliumValues = {
  [Stat.LUK]: 5,
  [Stat.XP]: 1,
  [Stat.GOLD]: 10
};

const scoreValues = {
  [Stat.HP]: 1,

  [Stat.STR]: 4,
  [Stat.INT]: 3,
  [Stat.DEX]: 1,
  [Stat.AGI]: 1,
  [Stat.CON]: 3,
  [Stat.LUK]: 5,

  [Stat.XP]: 10,
  [Stat.GOLD]: 3,
};

export class Item implements IItem {

  // internal vars
  public id: string;

  public foundAt: number;
  public name: string;
  public type: ItemSlot;
  public score: number;
  public baseScore: number;
  public itemClass: ItemClass;
  public enchantLevel: number;
  public stats: { [key in Stat]?: number };

  init(opts) {
    extend(this, opts);
    if(!this.id) this.id = uuid();
    if(!this.foundAt) this.foundAt = Date.now();
    if(!this.stats) this.stats = {};
    if(!this.itemClass) this.itemClass = 'basic';

    this.recalculateScore();
  }

  public recalculateScore() {
    const score = this.calcScore();
    if(!this.baseScore) this.baseScore = score;
    this.score = score;
  }

  private calcScore(): number {
    return Object.keys(scoreValues)
      .map(statKey => (this.stats[statKey] || 0) * scoreValues[statKey])
      .reduce((prev, cur) => prev + cur, 0);
  }

  private resourceValue(player: Player, hash: any): number {
    return Object.keys(hash)
      .map(statKey => Math.floor((this.stats[statKey] || 0) / hash[statKey]))
      .reduce((prev, cur) => prev + cur, 0);
  }

  public woodValue(player: Player): number {
    return this.resourceValue(player, woodValues);
  }

  public clayValue(player: Player): number {
    return this.resourceValue(player, clayValues);
  }

  public stoneValue(player: Player): number {
    return this.resourceValue(player, stoneValues);
  }

  public astraliumValue(player: Player): number {
    return this.resourceValue(player, astraliumValues);
  }

  public isCurrentlyEnchantable(player: Player): boolean {
    return this.enchantLevel < MAX_ENCHANT_LEVEL;
  }

  public isUnderBoostablePercent(player: Player): boolean {
    return (this.score / this.baseScore) < MAX_DIFF_PERCENT;
  }
}
