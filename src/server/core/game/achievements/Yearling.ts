import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Yearling extends Achievement {

  static readonly statWatches = ['Game/Logins'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    let baseStr = `You logged on at least a year ago for the first time! Gain +${10 * tier}% to all stats.`;

    if(tier >= 1) {
      baseStr = `${baseStr} Title: Single Yearling. Genders: veteran male, veteran female.`;
    }

    if(tier >= 2) {
      baseStr = `${baseStr} Title: Double Yearling. Genders: angry bear, mighty glowcloud.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const startDate = new Date(player.createdAt);
    const now = new Date();

    return now.getFullYear() - startDate.getFullYear();
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]:  1 + (tier * 0.1),
        [Stat.DEX]:  1 + (tier * 0.1),
        [Stat.CON]:  1 + (tier * 0.1),
        [Stat.AGI]:  1 + (tier * 0.1),
        [Stat.INT]:  1 + (tier * 0.1),
        [Stat.LUK]:  1 + (tier * 0.1),
        [Stat.XP]:   1 + (tier * 0.1),
        [Stat.GOLD]: 1 + (tier * 0.1),
      } }
    ];

    if(tier >= 1) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Single Yearling' });
      baseRewards.push({ type: AchievementRewardType.Gender, gender: 'veteran male' });
      baseRewards.push({ type: AchievementRewardType.Gender, gender: 'veteran female' });
    }

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Double Yearling' });
      baseRewards.push({ type: AchievementRewardType.Gender, gender: 'angry bear' });
      baseRewards.push({ type: AchievementRewardType.Gender, gender: 'mighty glowcloud' });
    }

    return baseRewards;
  }
}
