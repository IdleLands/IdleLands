import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class ThatDayOfTheYear extends Achievement {

  static readonly statWatches = ['Game/Logins'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    const baseStr = `Personality: Gullible`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const date = new Date();
    return date.getUTCMonth() + 1 === 4 && date.getUTCDate() === 1 ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Personality, personality: 'Gullible' },
    ];

    return baseRewards;
  }
}
