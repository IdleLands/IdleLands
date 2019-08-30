import { AchievementType, AchievementRewardType, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class TinyTerror extends Achievement {

  static readonly statWatches = ['Item/Collectible/Find'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain two tiny genders and a title for being a master of the dwarves.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const coll1 = player.$collectibles.has('Dwarven Coin');
    const coll2 = player.$collectibles.has('Dwarven Protection Rune');
    const coll3 = player.$collectibles.has('Crystal Maul');
    const kill = player.$statistics.get('BossKill/Boss/Venerable Dwarven Lord');

    return coll1 && coll2 && coll3 && kill ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Dwarven Lord' },
      { type: AchievementRewardType.Gender, gender: 'dwarven male' },
      { type: AchievementRewardType.Gender, gender: 'dwarven female' }
    ];

    return baseRewards;
  }
}
