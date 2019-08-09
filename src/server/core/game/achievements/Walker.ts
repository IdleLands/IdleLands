import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Walker extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Character/Ticks'];
  static readonly type = AchievementType.Progress;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier} XP and +${tier} GOLD for walking ${Math.pow(Walker.base, tier).toLocaleString()} steps.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Personality: ScaredOfTheDark/Delver.`;
    }

    if(tier >= 3) {
      baseStr = `${baseStr} Personality: Camping.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Walker.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Taxes Ranger.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Ticks');
    return Math.floor(Achievement.log(steps, Walker.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Stats, stats: { [Stat.GOLD]: tier, [Stat.XP]: tier } }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'ScaredOfTheDark' });
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Delver' });
    }

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Camping' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.DeathMessage, message: '%player stepped away into death.' });
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Walker' });
    }

    if(tier >= 6) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Taxes Ranger' });
    }

    return baseRewards;
  }
}
