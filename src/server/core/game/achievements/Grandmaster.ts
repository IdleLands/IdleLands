import { AchievementType, AchievementRewardType, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class TinyTerror extends Achievement {

  static readonly statWatches = ['BossKill/Total'];
  static readonly type = AchievementType.Explore;
  static readonly base = 5;

  static descriptionForTier(tier: number): string {
    const baseStr = `Become a Grandmaster by checkmating your opponent ${base} times.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const kill = player.$statistics.get('BossKill/Boss/Black Queen');

    return kill >= base ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Grandmaster' },
    ];

    return baseRewards;
  }
}
