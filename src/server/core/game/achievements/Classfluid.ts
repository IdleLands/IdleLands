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
        [Stat.STR]: 1.1,
        [Stat.DEX]: 1.1,
        [Stat.CON]: 1.1,
        [Stat.INT]: 1.1,
        [Stat.AGI]: 1.1,
        [Stat.LUK]: 1.1
      } }
    ];

    return baseRewards;
  }
}
