import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Entitled extends Achievement {

  static readonly base = 50;

  static readonly statWatches = ['Game/Logins'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title (Entitled) for having 50 titles.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$achievements.getTitles().length;
    return steps >= Entitled.base ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Entitled' }
    ];

    return baseRewards;
  }
}
