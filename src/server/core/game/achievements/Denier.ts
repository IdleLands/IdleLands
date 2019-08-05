import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Denier extends Achievement {

  static readonly base = 5000;

  static readonly statWatches = ['Character/Choose/Personality/Denier'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title and +2 base XP for choosing No many times.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Choose/Personality/Denier');
    return steps >= Denier.base ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Stats, stats: { [Stat.XP]: 2 } },
      { type: AchievementRewardType.Title, title: 'No-Way-Dude' }
    ];

    return baseRewards;
  }
}
