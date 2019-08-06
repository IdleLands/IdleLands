import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Swinger extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Combat/All/Give/Attack/Times'];
  static readonly type = AchievementType.Combat;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% DEX for attacking ${Math.pow(Swinger.base, tier).toLocaleString()} times.`;

    if(tier >= 3) {
      baseStr = `${baseStr} Personality: Dextrous.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Fastidious Fencer.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Combat/All/Give/Attack/Times');
    return Math.floor(Achievement.log(steps, Swinger.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.DEX]: 1 + (tier * 0.05)
       } }
    ];

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Dextrous' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Fastidious Fencer' });
    }

    return baseRewards;
  }
}
