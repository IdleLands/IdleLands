import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Raider extends Achievement {

  static readonly base = 50;

  static readonly statWatches = ['Raid/Total/Win'];
  static readonly type = AchievementType.Combat;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier}% to all stats for killing ${(tier * Raider.base).toLocaleString()} raid bosses.`;

    if(tier >= 4) {
      baseStr = `${baseStr} Title: Raider.`;
    }

    if(tier >= 10) {
      baseStr = `${baseStr} Title: Raider Rabbit.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Raid/Total/Win');
    return Math.floor(steps / Raider.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.01),
        [Stat.DEX]: 1 + (tier * 0.01),
        [Stat.CON]: 1 + (tier * 0.01),
        [Stat.INT]: 1 + (tier * 0.01),
        [Stat.AGI]: 1 + (tier * 0.01),
        [Stat.LUK]: 1 + (tier * 0.01)
      } }
    ];

    if(tier >= 4) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Raider' });
    }

    if(tier >= 10) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Raiding Rabbit' });
    }

    return baseRewards;
  }
}
