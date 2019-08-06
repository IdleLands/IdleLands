import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Quickfooted extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Combat/All/Receive/Miss'];
  static readonly type = AchievementType.Combat;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% AGI for dodging ${Math.pow(Quickfooted.base, tier).toLocaleString()} times.`;

    if(tier >= 3) {
      baseStr = `${baseStr} Personality: Agile.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Fleet of Foot.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Combat/All/Receive/Miss');
    return Math.floor(Achievement.log(steps, Quickfooted.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.AGI]: 1 + (tier * 0.05)
       } }
    ];

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Agile' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Fleet of Foot' });
    }

    return baseRewards;
  }
}
