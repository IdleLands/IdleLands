import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Touchy extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Item/Collectible/Touch'];
  static readonly type = AchievementType.Progress;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier}% XP for touching ${Math.pow(Touchy.base, tier).toLocaleString()} collectibles.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Touchy Feely.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Item/Collectible/Touch');
    return Math.floor(Achievement.log(steps, Touchy.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: { [Stat.XP]: 1 + (tier * 0.01) } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.DeathMessage, message: '%player touched death. Death touched back.' });
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Touchy Feely' });
    }

    return baseRewards;
  }
}
