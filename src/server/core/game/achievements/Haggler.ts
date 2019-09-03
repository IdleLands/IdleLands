import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Haggler extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Item/Sell/Times'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% INT for selling ${Math.pow(Haggler.base, tier).toLocaleString()} items.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Personality: Intelligent.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Hardy Haggler.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Item/Sell/Times');
    return Math.floor(Achievement.log(steps, Haggler.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.INT]: 1 + (tier * 0.05)
       } }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Intelligent' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Hardy Haggler' });
    }

    return baseRewards;
  }
}
