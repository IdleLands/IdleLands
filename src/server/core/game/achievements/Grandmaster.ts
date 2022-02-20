import { AchievementType, AchievementRewardType, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Grandmaster extends Achievement {

  static readonly statWatches = ['BossKill/Total'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    const baseStr = `Become a Grandmaster by checkmating your opponent in a game of chess.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const kill = player.$statistics.get('BossKill/Boss/Black Queen');

    return kill ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Grandmaster' }
    ];

    return baseRewards;
  }
}
