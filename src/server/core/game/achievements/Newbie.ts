import { AchievementType, AchievementRewardType, Stat, Achievement, IAchievementReward } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Newbie extends Achievement {

  static readonly statWatches = [];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    return `Welcome to IdleLands!
      You get a base bonus of +5 XP.
      You also get a starting title: Newbie.
      Additionally, you get three personalities: Affirmer, Denier, Indecisive.`;
  }

  static calculateTier(player: Player): number {
    return 1;
  }

  static rewardsForTier(tier: number): IAchievementReward[] {
    return [
      { type: AchievementRewardType.Stats, stats: { [Stat.XP]: 5 } },
      { type: AchievementRewardType.Title, title: 'Newbie' },
      { type: AchievementRewardType.Title, title: 'Logged In' },
      { type: AchievementRewardType.Personality, personality: 'Affirmer' },
      { type: AchievementRewardType.Personality, personality: 'Denier' },
      { type: AchievementRewardType.Personality, personality: 'Indecisive' }
    ];
  }
}
