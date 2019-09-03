import { AchievementType, AchievementRewardType, Stat, Achievement, PermanentUpgrade } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Forager extends Achievement {

  static readonly base = 5;

  static readonly statWatches = ['Pet/Gather/Total'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier} XP for pet-gathering ${Math.pow(Forager.base, tier).toLocaleString()} items.`;

    if(tier >= 3) {
      baseStr = `${baseStr} Personality: Forager.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Gatherer of Goods.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Pet/Gather/Total');
    return Math.floor(Achievement.log(steps, Forager.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Stats, stats: {
        [Stat.XP]: (tier)
       } }
    ];

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Forager' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Gatherer Of Goods' });
    }

    return baseRewards;
  }
}
