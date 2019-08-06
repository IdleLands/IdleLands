import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Explorer extends Achievement {

  static readonly base = 5;

  static readonly statWatches = ['Game/Logins'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 25} to all stats for exploring ${(tier * Explorer.base).toLocaleString()} maps.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Explorer of Norkos.`;
    }

    if(tier >= 15) {
      baseStr = `${baseStr} Title: Explorer of Cabran.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.getChildrenCount('Map');
    return Math.floor(steps / Explorer.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Stats, stats: {
        [Stat.STR]: tier * 25,
        [Stat.CON]: tier * 25,
        [Stat.INT]: tier * 25,
        [Stat.DEX]: tier * 25,
        [Stat.AGI]: tier * 25,
        [Stat.LUK]: tier * 25,
      } },
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Explorer of Norkos' });
    }

    if(tier >= 15) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Explorer of Cabran' });
    }

    return baseRewards;
  }
}
