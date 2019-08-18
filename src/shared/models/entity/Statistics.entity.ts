
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { get, set, isNumber } from 'lodash';

import { PlayerOwned } from './PlayerOwned';

/**
 * Super-categories:
 * - Game (tracks logins, other game metadata)
 * - Character (tracks character-specific stats)
 * - Event (tracks event-specific stats) (Event.{X}.Times/Other)
 * - Guild (tracks guild-specific stats) (Guild.{X})
 * - Item (tracks item-specific stats) (Item.{X})
 * - Profession (tracks profession-specific stats) (Profession.{X}.Steps/Times)
 * - Environment (tracks environment-specific stats) (Environment.Terrain.{X})
 * - Pet (tracks pet-specific stats)
 * - BossKill (tracks boss kills)
 * - Combat (tracks combat-related stats)
 * - Map (tracks map visits)
 */

@Entity()
export class Statistics extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private statistics: any;

  public get $statisticsData() {
    return this.statistics;
  }

  constructor() {
    super();
    if(!this.statistics) this.statistics = {};
  }

  public increase(stat: string, value = 1): void {
    if(isNaN(value)) throw new Error(`${stat} being incremented by NaN!`);
    if(!isFinite(value)) throw new Error(`${stat} being incremented by Infinity!`);
    if(stat.includes('.')) throw new Error(`${stat} path contains a "."! Use "/" instead.`);

    const curVal = this.get(stat);
    this.set(stat, Math.floor(curVal + value));
  }

  public get(stat: string): number|any {
    if(stat.includes('.')) throw new Error(`${stat} path contains a "."! Use "/" instead.`);

    return get(this.statistics, stat.split('/'), 0);
  }

  public set(stat: string, value: number): void {
    if(isNaN(value) || !isFinite(value)) return;

    set(this.statistics, stat.split('/'), value);
  }

  public getChildren(stat: string): string[] {
    return Object.keys(this.get(stat));
  }

  public getChildrenCount(stat: string): number {
    const statB = this.get(stat);
    return isNumber(statB) ? statB : Object.keys(statB).length;
  }
}
