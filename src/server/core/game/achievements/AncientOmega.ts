import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class AncientOmega extends Achievement {

  static readonly statWatches = ['Game/IdleLands2/Played'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title, +15 XP, +100 GOLD, and +10% to all stats for supporting this crazy ride for 6 years.
    You're amazing. And here's hoping the game never needs another rewrite! 🍻`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$statistics.get('Game/IdleLands2/Played') ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Stats, stats: {
        [Stat.GOLD]: 100,
        [Stat.XP]: 15
       } },
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.1),
        [Stat.INT]: 1 + (tier * 0.1),
        [Stat.AGI]: 1 + (tier * 0.1),
        [Stat.DEX]: 1 + (tier * 0.1),
        [Stat.CON]: 1 + (tier * 0.1),
        [Stat.LUK]: 1 + (tier * 0.1),
        [Stat.HP]: 1 + (tier * 0.1),
        [Stat.GOLD]: 1 + (tier * 0.1),
        [Stat.XP]: 1 + (tier * 0.1)
       } },
       { type: AchievementRewardType.Title, title: 'Alpha & Omega ♊' }
    ];

    return baseRewards;
  }
}
