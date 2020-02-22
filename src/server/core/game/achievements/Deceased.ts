import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Deceased extends Achievement {
  static prefix = 'Hardcore';

  static readonly statWatches = ['Hardcore/Dead'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title for being dead!  Grants nothing else.  Because you're dead. ☠`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$statistics.get('Hardcore/Dead') === 1 ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Deceased' }
    ];

    return baseRewards;
  }
}
