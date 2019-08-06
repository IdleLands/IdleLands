import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Blessed extends Achievement {

  static readonly statWatches = ['Event/BlessGold/Times', 'Event/BlessXP/Times', 'Event/BlessItem/Times'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title and pet attribute (Blessed) for being blessed 5,000 times.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Event/BlessGold/Times')
                + player.$statistics.get('Event/BlessXP/Times')
                + player.$statistics.get('Event/BlessItem/Times');
    return steps >= 5000 ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: '#blessed' },
      { type: AchievementRewardType.PetAttribute, petattr: PetAttribute.Blessed }
    ];

    return baseRewards;
  }
}
