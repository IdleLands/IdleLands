import { AchievementType, AchievementRewardType, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Grandmaster extends Achievement {

  static readonly statWatches = ['Item/Collectible/Find', 'BossKill/Total'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    const baseStr = `Become a Grandmaster by checkmating your opponent in a game of chess.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const coll1 = player.$collectibles.has('White King\'s Pawn');
    const coll2 = player.$collectibles.has('Black King\'s Pawn');
    const coll3 = player.$collectibles.has('White King\'s Bishop');
    const coll4 = player.$collectibles.has('Black Queen\'s Pawn');
    const coll5 = player.$collectibles.has('White Queen');
    const coll6 = player.$collectibles.has('Black Queen\'s Knight');
    const coll7 = player.$collectibles.has('Scholar\'s Mate');
    const kill = player.$statistics.get('BossKill/Boss/Black Queen');

    return coll1 && coll2 && coll3 && coll4 && coll5 && coll6 && coll7 && kill ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Grandmaster' }
    ];

    return baseRewards;
  }
}
