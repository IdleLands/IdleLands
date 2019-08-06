import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Consumerist extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Character/Gold/Spend'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 2}% GOLD and +${tier * 3}% DEX for spending ${Math.pow(Consumerist.base, tier).toLocaleString()} gold.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Consumerist.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Gold/Spend');
    return Math.floor(Achievement.log(steps, Consumerist.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.GOLD]: 1 + (tier * 0.02),
        [Stat.DEX]: 1 + (tier * 0.03)
       } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Consumerist' });
    }

    return baseRewards;
  }
}
