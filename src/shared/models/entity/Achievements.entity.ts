
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { get } from 'lodash';

import { PlayerOwned } from './PlayerOwned';
import { IAchievement } from '../../interfaces';

@Entity()
export class Achievements extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private achievements: { [key: string]: IAchievement };

  public get $achievementsData() {
    return { achievements: this.achievements };
  }

  constructor() {
    super();
    if(!this.achievements) this.achievements = {};
  }

  public addAchievement(ach: IAchievement): void {
    this.achievements[ach.name] = ach;
  }

  public getAchievementAchieved(achName: string): number {
    return get(this.achievements, [achName, 'achievedAt'], 0);
  }

  public getAchievementTier(achName: string): number {
    return get(this.achievements, [achName, 'tier'], 0);
  }

  public resetAchievementsTo(ach: IAchievement[]): void {
    this.achievements = {};

    ach.forEach(achi => this.addAchievement(achi));
  }

}
