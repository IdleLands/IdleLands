import { AchievementType, AchievementRewardType, Stat, Achievement, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Golden extends Achievement {

  static readonly base = 20;

  static readonly statWatches = ['Character/Gold/Gain', 'Character/Gold/Lose'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 3}% AGI for gaining and losing a total of ${Math.pow(Golden.base, tier).toLocaleString()} gold.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Personality: Greedy.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Golden Child. Pet Attribute: Golden.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Gold/Gain') + player.$statistics.get('Character/Gold/Lose');
    return Math.floor(Achievement.log(steps, Golden.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.AGI]: 1 + (tier * 0.03)
       } }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Greedy' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Golden Child' });
      baseRewards.push({ type: AchievementRewardType.PetAttribute, petattr: PetAttribute.Golden });
    }

    return baseRewards;
  }
}
