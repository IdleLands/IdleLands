import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Sponge extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Combat/All/Receive/Damage'];
  static readonly type = AchievementType.Combat;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% CON for taking ${Math.pow(Sponge.base, tier).toLocaleString()} damage.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Porifera.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Combat/All/Receive/Damage');
    return Math.floor(Achievement.log(steps, Sponge.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.CON]: 1 + (tier * 0.05)
       } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Porifera' });
    }

    return baseRewards;
  }
}
