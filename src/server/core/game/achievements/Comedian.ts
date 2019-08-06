import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Comedian extends Achievement {

  static readonly base = 5;

  static readonly statWatches = ['Profession/Jester/AbilityUses'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier} achievement(s) for jesting ${Math.pow(Comedian.base, tier).toLocaleString()} times.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Personality: Lucky.`;
    }

    if(tier >= 6) {
      baseStr = `${baseStr} Title: Comedian.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Profession/Jester/AbilityUses');
    return Math.floor(Achievement.log(steps, Comedian.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Lucky' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Comedian' });
    }

    return baseRewards;
  }
}
