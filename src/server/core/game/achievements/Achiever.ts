import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Achiever extends Achievement {

  static readonly base = 30;

  static readonly statWatches = ['Game/Logins'];
  static readonly type = AchievementType.Progress;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier} achievement tiers for achieving ${(tier * Achiever.base).toLocaleString()} achievements. Achievements.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Overachiever.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$achievements.totalAchievementTiers();
    return Math.floor(steps / Achiever.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Achiever' });
    }

    return baseRewards;
  }
}
