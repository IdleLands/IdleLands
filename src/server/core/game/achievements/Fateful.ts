import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Fateful extends Achievement {

  static readonly statWatches = ['Event/Providence/Times'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain a title and pet attribute (Fateful) for using the Fate Pools 500 times.`;
    if(tier >= 2) {
      baseStr = `${baseStr} You're also insane. You did it 100,000 times.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Event/Providence/Times');
    if(steps >= 100000) return 2;
    if(steps >= 500) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Fateful' },
      { type: AchievementRewardType.PetAttribute, petattr: PetAttribute.Fateful }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Tempter of Fate' });
    }

    return baseRewards;
  }
}
