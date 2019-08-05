import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Jailbird extends Achievement {

  static readonly statWatches = ['Item/Collectible/Find'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    const baseStr = `You found the Jailbrick. You now have Jailbird.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$collectibles.has('Jail Brick') ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Jailbird' }
    ];

    return baseRewards;
  }
}
