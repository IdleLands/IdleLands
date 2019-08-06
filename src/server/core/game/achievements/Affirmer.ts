import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Affirmer extends Achievement {

  static readonly base = 5000;

  static readonly statWatches = ['Character/Choose/Personality/Affirmer'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title, +1 Choice Log Size and +2 base XP for choosing Yes many times.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Choose/Personality/Affirmer');
    return steps >= Affirmer.base ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.ChoiceLogSizeBoost]: 1 } },
      { type: AchievementRewardType.Stats, stats: { [Stat.XP]: 2 } },
      { type: AchievementRewardType.Title, title: 'Yes-Person' }
    ];

    return baseRewards;
  }
}
