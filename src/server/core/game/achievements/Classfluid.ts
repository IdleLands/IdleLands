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
        [Stat.STR]: 0.1,
        [Stat.DEX]: 0.1,
        [Stat.CON]: 0.1,
        [Stat.INT]: 0.1,
        [Stat.AGI]: 0.1,
        [Stat.LUK]: 0.1
      } }
    ];

    return baseRewards;
  }
}
