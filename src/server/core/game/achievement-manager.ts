import { Singleton, AutoWired } from 'typescript-ioc';
import { compact } from 'lodash';

import * as Achievements from './achievements';
import { Player } from '../../../shared/models';
import { IAchievement } from '../../../shared/interfaces';

@Singleton
@AutoWired
export class AchievementManager {

  public statToAchievement: { [key: string]: any[] } = {};

  public init() {
    Object.keys(Achievements).forEach(achievementName => {
      const ach = Achievements[achievementName];
      if(!ach.statWatches) return;

      ach.statWatches.forEach(stat => {
        this.statToAchievement[stat] = this.statToAchievement[stat] || [];
        this.statToAchievement[stat].push(ach);
      });
    });
  }

  private getAchievementObject(player: Player, achName: string, alwaysGet = false): IAchievement {
    const ach = Achievements[achName];

    const tier = ach.calculateTier(player);
    if(tier === 0) return;

    const existingTier = alwaysGet ? 0 : player.$achievements.getAchievementTier(ach.name);
    if(tier === existingTier) return;

    const existingAchAt = alwaysGet ? player.$achievements.getAchievementAchieved(ach.name) : 0;

    const achObj: IAchievement = {
      name: ach.name,
      achievedAt: existingAchAt || Date.now(),
      tier,
      desc: ach.descriptionForTier(tier),
      type: ach.type,
      rewards: ach.rewardsForTier(tier)
    };

    return achObj;
  }

  public checkAchievementsFor(player: Player, stat: string): IAchievement[] {
    if(!this.statToAchievement[stat]) return [];

    const newAchievements = [];

    this.statToAchievement[stat].forEach(ach => {
      const achObj = this.getAchievementObject(player, ach.name);
      if(!achObj) return;

      newAchievements.push(achObj);

      player.$achievements.addAchievement(achObj);
    });

    return newAchievements;
  }

  public syncAchievements(player: Player): void {
    const allEarnedAchievements = compact(
      Object.keys(Achievements).map(achName => this.getAchievementObject(player, achName, true))
    );
    player.$achievements.resetAchievementsTo(allEarnedAchievements);
  }

}
