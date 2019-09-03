import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class AroundTheWorld extends Achievement {

  static readonly statWatches = ['Quest/Global/Total'];
  static readonly type = AchievementType.Progress;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% and GOLD for participating in global quests in ${tier * 5} unique maps.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: World Traveler.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const uniqueMaps = player.$statistics.getChildrenCount('Quest/Global/Map');
    return Math.floor(uniqueMaps / 5);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.GOLD]: 1.05
      } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'World Traveler' });
    }

    return baseRewards;
  }
}
