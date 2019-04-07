import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Walker extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Character.Ticks'];
  static readonly type = AchievementType.Progress;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 2}% XP and +${tier} GOLD for walking ${Math.pow(Walker.base, tier).toLocaleString()} steps.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Walker.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character.Ticks');
    return Achievement.log(steps, Walker.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Stats, stats: { [Stat.GOLD]: tier } },
      { type: AchievementRewardType.StatMultipliers, stats: { [Stat.XP]: 1 + (tier * 0.02) } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.DeathMessage, message: '%player stepped away into death.' });
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Walker' });
    }

    return baseRewards;
  }
}
