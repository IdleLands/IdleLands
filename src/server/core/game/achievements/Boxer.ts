import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Boxer extends Achievement {

  static readonly base = 25;

  static readonly statWatches = ['Treasure/Total/ItemsFound'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 3}% DEX/INT for finding ${(tier * Boxer.base).toLocaleString()} treasure chest items.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Boxer.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Treasure/Total/ItemsFound');
    return Math.floor(steps / Boxer.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.DEX]: 1 + (tier * 0.03),
        [Stat.INT]: 1 + (tier * 0.03)
      } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Bodacious Boxer' });
    }

    return baseRewards;
  }
}
