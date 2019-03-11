
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { get, set } from 'lodash';

import { PlayerOwned } from './PlayerOwned';

/**
 * Super-categories:
 * - Game (tracks logins, other game metadata)
 * - Character (tracks character-specific stats)
 * - Event (tracks event-specific stats (Event.{X}.Times/Other))
 * - Profession (tracks profession-specific stats (Profession.{X}.Steps/Times))
 * - Environment (tracks environment-specific stats (Environment.Terrain.{X}))
 * - Pet (tracks pet-specific stats)
 * - BossKill (tracks boss kills)
 * - Combat (tracks combat-related stats)
 * - Map (tracks map visits)
 * - Region (tracks region visits)
 */

@Entity()
export class Statistics extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private statistics: any;

  public get statisticsData() {
    return this.statistics;
  }

  constructor() {
    super();
    if(!this.statistics) this.statistics = {};
  }

  public increase(stat: string, value = 1): void {
    if(isNaN(value)) throw new Error(`${stat} being incremented by NaN!`);

    const curVal = this.get(stat);
    this.set(stat, curVal + value);
  }

  public get(stat: string): number {
    return get(this.statistics, stat, 0);
  }

  public set(stat: string, value: number): void {
    if(isNaN(value)) throw new Error(`${stat} being set to NaN!`);

    set(this.statistics, stat, value);
  }
}
