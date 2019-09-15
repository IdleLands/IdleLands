
import { extend } from 'lodash';
import * as uuid from 'uuid/v4';

import { Player } from './entity/Player.entity';
import { IItem, ItemClass, ItemSlot, Stat, PartialItem, GuildBuilding } from '../interfaces';

const woodValues = {
  [Stat.STR]: 50,
  [Stat.DEX]: 100,
  [Stat.AGI]: 100
};

const clayValues = {
  [Stat.INT]: 50,
  [Stat.DEX]: 100,
  [Stat.AGI]: 100
};

const stoneValues = {
  [Stat.CON]: 50,
  [Stat.DEX]: 100,
  [Stat.AGI]: 100
};

const astraliumValues = {
  [Stat.LUK]: 500,
  [Stat.XP]: 25,
  [Stat.GOLD]: 50
};

export const ItemScoreValues = {
  [Stat.HP]: 1,

  [Stat.STR]: 5,
  [Stat.INT]: 4,
  [Stat.DEX]: 2,
  [Stat.AGI]: 2,
  [Stat.CON]: 4,
  [Stat.LUK]: 6,

  [Stat.XP]: 20,
  [Stat.GOLD]: 10,
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
  public locked: boolean;

  static calcScoreForHash(hash: any): number {
    return Object.keys(ItemScoreValues)
      .map(statKey => (hash[statKey] || 0) * ItemScoreValues[statKey])
      .reduce((prev, cur) => Math.floor(prev + cur), 0);
  }

  init(opts: PartialItem) {
    extend(this, opts);
    if(!this.id) this.id = uuid();
    if(!this.foundAt) this.foundAt = Date.now();
    if(!this.stats) this.stats = { };
    if(!this.itemClass) this.itemClass = ItemClass.Basic;
    if(!this.enchantLevel) this.enchantLevel = 0;

    this.recalculateScore();
  }

  public recalculateScore() {
    const score = this.calcScore();
    if(!this.baseScore) this.baseScore = score;
    this.score = score;
  }

  public fullName(): string {
    if(this.enchantLevel) return `+${this.enchantLevel} ${this.name}`;
    return this.name;
  }

  private calcScore(): number {
    return Item.calcScoreForHash(this.stats);
  }

  private resourceValue(player: Player, hash: any): number {

    const modPercent = player.getStat(Stat.SALVAGE);

    const baseSalvage = Object.keys(hash)
      .map(statKey => Math.max(0, this.stats[statKey] || 0) / hash[statKey])
      .reduce((prev, cur) => Math.floor(prev + cur), 0);

    return Math.floor(baseSalvage + ((modPercent / 100) * baseSalvage));
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
    let maxEnchantCap = player.$statistics.get('Game/Premium/Upgrade/EnchantCap');

    const guild = player.$$game.guildManager.getGuildForPlayer(player);
    if(guild) {
      const bonus = guild.buildingBonus(GuildBuilding.Enchantress);
      maxEnchantCap += bonus;
    }

    return this.enchantLevel < maxEnchantCap;
  }

  public isUnderBoostablePercent(player: Player): boolean {
    return (this.score / this.baseScore) < (player.$statistics.get('Game/Premium/Upgrade/ItemStatCap') / 100);
  }
}
