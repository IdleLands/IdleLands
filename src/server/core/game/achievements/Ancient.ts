import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Ancient extends Achievement {

  static readonly statWatches = ['Game/IdleLands3/Played'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title, +5 XP, +20 GOLD, and +5% to all stats for taking a chance on this game,
    even after all of it's major problems. Hopefully this launch goes more smoothly! 🍻`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$statistics.get('Game/IdleLands3/Played') ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Stats, stats: {
        [Stat.GOLD]: 20,
        [Stat.XP]: 5
       } },
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.05),
        [Stat.INT]: 1 + (tier * 0.05),
        [Stat.AGI]: 1 + (tier * 0.05),
        [Stat.DEX]: 1 + (tier * 0.05),
        [Stat.CON]: 1 + (tier * 0.05),
        [Stat.LUK]: 1 + (tier * 0.05),
        [Stat.HP]: 1 + (tier * 0.05),
        [Stat.GOLD]: 1 + (tier * 0.05),
        [Stat.XP]: 1 + (tier * 0.05)
       } },
       { type: AchievementRewardType.Title, title: 'Ancient ⚜️' }
    ];

    return baseRewards;
  }
}
