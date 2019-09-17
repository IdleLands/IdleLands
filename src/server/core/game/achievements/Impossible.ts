import { AchievementType, AchievementRewardType, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Impossible extends Achievement {

  static readonly statWatches = ['Item/Collectible/Find'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    const baseStr = `Cheater! You get a title.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$collectibles.has('How Did You Even Get Out Here') ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Literal Cheater' }
    ];

    return baseRewards;
  }
}
