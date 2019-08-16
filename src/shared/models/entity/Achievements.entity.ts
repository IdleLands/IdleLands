
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { get, compact, flatten, sortBy } from 'lodash';

import { PlayerOwned } from './PlayerOwned';
import { IAchievement, AchievementRewardType, PermanentUpgrade, PetAttribute } from '../../interfaces';
import { Player } from './Player.entity';

@Entity()
export class Achievements extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private achievements: { [key: string]: IAchievement };

  @Column()
  private permanentGenders: { [key: string]: boolean };

  public get $achievementsData() {
    return { achievements: this.achievements, permanentGenders: this.permanentGenders };
  }

  constructor() {
    super();
    if(!this.achievements) this.achievements = {};
    if(!this.permanentGenders) this.permanentGenders = {};
  }

  public init(player: Player) {
    player.$$game.achievementManager.checkAchievementsFor(player);
  }

  public hasBoughtGender(gender: string): boolean {
    return this.permanentGenders[gender];
  }

  public buyGender(gender: string): void {
    this.permanentGenders[gender] = true;
  }

  public add(ach: IAchievement): void {
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

    ach.forEach(achi => this.add(achi));
  }

  public totalAchievements(): number {
    return Object.keys(this.achievements).length;
  }

  public totalAchievementTiers(): number {
    return Object.values(this.achievements).reduce((prev, cur) => prev + cur.tier, 0);
  }

  public getPermanentUpgrades(): { [key in PermanentUpgrade]?: number } {
    return Object.values(this.achievements).reduce((prev, ach) => {
        const rewards = compact(
          ach.rewards
            .filter(reward => reward.type === AchievementRewardType.PermanentUpgrade)
        );

        rewards.forEach(reward => {
          Object.keys(reward.upgrades).forEach(upgrade => {
            prev[upgrade] = prev[upgrade] || 0;
            prev[upgrade] += reward.upgrades[upgrade];
          });
        });

        return prev;
      }, {});
  }

  public getTitles(): string[] {
    return sortBy(flatten(Object.values(this.achievements).map(ach => {
        return compact(
          ach.rewards
            .filter(reward => reward.type === AchievementRewardType.Title)
            .map(reward => reward.title)
        );
      })));
  }

  public getPersonalities(): string[] {
    return sortBy(flatten(Object.values(this.achievements).map(ach => {
        return compact(
          ach.rewards
            .filter(reward => reward.type === AchievementRewardType.Personality)
            .map(reward => reward.personality)
        );
      })));
  }

  public getPets(): string[] {
    return sortBy(flatten(Object.values(this.achievements).map(ach => {
        return compact(
          ach.rewards
            .filter(reward => reward.type === AchievementRewardType.Pet)
            .map(reward => reward.pet)
        );
      })));
  }

  public getGenders(): string[] {
    const base = ['male', 'female', 'not a bear', 'glowcloud', 'astronomical entity', 'soap']
      .concat(Object.keys(this.permanentGenders));

    return base.concat(flatten(Object.values(this.achievements).map(ach => {
      return compact(
        ach.rewards
          .filter(reward => reward.type === AchievementRewardType.Gender)
          .map(reward => reward.gender)
      );
    })));
  }

  public getPetAttributes(): PetAttribute[] {
    const base = [PetAttribute.Cursed];

    return base.concat(flatten(Object.values(this.achievements).map(ach => {
      return compact(
        ach.rewards
          .filter(reward => reward.type === AchievementRewardType.PetAttribute)
          .map(reward => reward.petattr)
      );
    })));
  }

}
