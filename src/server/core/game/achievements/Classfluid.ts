import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

import * as Professions from '../professions';

export class Classfluid extends Achievement {

  static readonly statWatches = ['Character.ProfessionChanges'];
  static readonly type = AchievementType.Progress;

  static descriptionForTier(): string {
    return 'Gain +10% to all stats for becoming each class once.';
  }

  static calculateTier(player: Player): number {
    const uniqueClasses = player.$statistics.getChildrenCount('Profession');
    return uniqueClasses === Object.keys(Professions).length ? 1 : 0;
  }

  static rewardsForTier(): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: { 
        [Stat.STR]: 0.05,
        [Stat.DEX]: 0.05,
        [Stat.CON]: 0.05,
        [Stat.INT]: 0.05,
        [Stat.AGI]: 0.05,
        [Stat.LUK]: 0.05
      } }
    ];

    return baseRewards;
  }
}
