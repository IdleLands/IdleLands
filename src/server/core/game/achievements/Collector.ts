import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Collector extends Achievement {

  static readonly base = 25;

  static readonly statWatches = ['Item/Collectible/Find'];
  static readonly type = AchievementType.Pet;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier}% to all stats for finding ${(tier * Collector.base).toLocaleString()} collectibles.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Collector.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$collectibles.getFoundCollectibles();
    return Math.floor(steps / Collector.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.01),
        [Stat.DEX]: 1 + (tier * 0.01),
        [Stat.CON]: 1 + (tier * 0.01),
        [Stat.INT]: 1 + (tier * 0.01),
        [Stat.AGI]: 1 + (tier * 0.01),
        [Stat.LUK]: 1 + (tier * 0.01)
      } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Collector' });
    }

    return baseRewards;
  }
}
