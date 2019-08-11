import { AchievementType, AchievementRewardType, Stat, Achievement, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Goldsent extends Achievement {

  static readonly base = 20;

  static readonly statWatches = ['Character/Ascension/Gold'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% GOLD for ascending with a total of ${Math.pow(Goldsent.base, tier).toLocaleString()} gold.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Goldsent.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Ascension/Gold');
    return Math.floor(Achievement.log(steps, Goldsent.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.GOLD]: 1 + (tier * 0.05)
       } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Goldsent' });
    }

    return baseRewards;
  }
}
