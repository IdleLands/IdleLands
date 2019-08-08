import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class AncientAscender extends Achievement {

  static readonly statWatches = ['Game/IdleLands3/Ascensions'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title and +${tier}% to all base stats for ascending ${tier} times in IdleLands 3! 🍻`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$statistics.get('Game/IdleLands3/Ascensions');
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.01),
        [Stat.INT]: 1 + (tier * 0.01),
        [Stat.AGI]: 1 + (tier * 0.01),
        [Stat.DEX]: 1 + (tier * 0.01),
        [Stat.CON]: 1 + (tier * 0.01),
        [Stat.LUK]: 1 + (tier * 0.01)
       } },
       { type: AchievementRewardType.Title, title: 'Traveler of the Stars ⭐' }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Glowing Star 🌟' });
    }

    if(tier >= 10) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'One with the Stars ✨' });
    }

    if(tier >= 15) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Shooting Star ☄️' });
    }

    if(tier >= 18) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Drunk Star 🍻' });
    }

    if(tier >= 20) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Staggering Star 💫' });
    }

    if(tier >= 25) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Seli Taiken 💥' });
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Zigniber 💥' });
    }

    if(tier >= 30) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Glopii 🍀' });
    }

    return baseRewards;
  }
}
