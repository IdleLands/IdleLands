import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Unstoppable extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Combat/All/Give/Damage'];
  static readonly type = AchievementType.Combat;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% STR for giving out ${Math.pow(Unstoppable.base, tier).toLocaleString()} damage.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Terror Train.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Combat/All/Give/Damage');
    return Math.floor(Achievement.log(steps, Unstoppable.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.05)
       } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Terror Train' });
    }

    return baseRewards;
  }
}
