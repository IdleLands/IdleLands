import { AchievementType, AchievementRewardType, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Fool extends Achievement {

  static readonly base = 18;

  static readonly statWatches = ['Character/Experience/Levels'];
  static readonly type = AchievementType.Progress;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain the Drunk personality.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.level.total >= 18 ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Personality, personality: 'Drunk' }
    ]

    return baseRewards;
  }
}
