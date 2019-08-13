import { AchievementType, AchievementRewardType, Achievement, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Forsaken extends Achievement {

  static readonly statWatches = ['Event/ForsakeGold/Times', 'Event/ForsakeXP/Times', 'Event/ForsakeItem/Times'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title for being forsaken 5,000 times. You already have the pet attribute.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Event/ForsakeGold/Times')
                + player.$statistics.get('Event/ForsakeXP/Times')
                + player.$statistics.get('Event/ForsakeItem/Times');
    return steps >= 5000 ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: '#superdupercursed' }
    ];

    return baseRewards;
  }
}
