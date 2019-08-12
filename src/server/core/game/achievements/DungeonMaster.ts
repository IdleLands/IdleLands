import { AchievementType, AchievementRewardType, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class DungeonMaster extends Achievement {

  static readonly statWatches = ['Item/Collectible/Touch'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title (Dungeon Master) and a gender (sentient sword) for getting the Sword in the Stone.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$collectibles.has('Sword in the Stones') ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Dungeon Master' },
      { type: AchievementRewardType.Gender, gender: 'sentient sword' }
    ];

    return baseRewards;
  }
}
