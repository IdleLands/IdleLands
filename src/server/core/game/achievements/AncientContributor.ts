import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class AncientContributor extends Achievement {

  static readonly statWatches = ['Game/IdleLands3/Contributor'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title and +5% to all base stats for believing in this project and making it better for the community! 🍻`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$statistics.get('Game/IdleLands3/Contributor') ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.05),
        [Stat.INT]: 1 + (tier * 0.05),
        [Stat.AGI]: 1 + (tier * 0.05),
        [Stat.DEX]: 1 + (tier * 0.05),
        [Stat.CON]: 1 + (tier * 0.05),
        [Stat.LUK]: 1 + (tier * 0.05)
       } },
       { type: AchievementRewardType.Title, title: 'Historian 🔍' }
    ];

    return baseRewards;
  }
}
