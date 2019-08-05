import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Herder extends Achievement {

  static readonly base = 5;

  static readonly statWatches = ['Pet/Buy/Times'];
  static readonly type = AchievementType.Pet;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier}% STR for buying ${(tier * Herder.base).toLocaleString()} pet(s).`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Herder.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Pet/Buy/Times');
    return Math.floor(steps / Herder.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: { [Stat.STR]: 1 + (tier * 0.01) } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Herder' });
    }

    return baseRewards;
  }
}
