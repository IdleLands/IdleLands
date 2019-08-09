import { AchievementType, AchievementRewardType, Achievement, PremiumTier } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Premium extends Achievement {

  static readonly statWatches = ['Game/Premium/Tier'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Game/Premium/Tier');
    if(steps >= PremiumTier.Subscriber3) return 4;
    if(steps >= PremiumTier.Subscriber2) return 3;
    if(steps >= PremiumTier.Subscriber)  return 2;
    if(steps >= PremiumTier.Subscriber3) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Donator' }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Patron' });
    }

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Patron Saint' });
    }

    if(tier >= 4) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Golden Patron' });
    }

    return baseRewards;
  }
}
