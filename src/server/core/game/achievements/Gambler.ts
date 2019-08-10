import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Gambler extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Event/Gamble/Wager'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 3}% LUK for spending ${Math.pow(Gambler.base, tier).toLocaleString()} gold on gambling.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Two-headed Coin.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Event/Gamble/Wager');
    return Math.floor(Achievement.log(steps, Gambler.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.LUK]: 1 + (tier * 0.03)
       } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Two-headed Coin' });
    }

    return baseRewards;
  }
}
