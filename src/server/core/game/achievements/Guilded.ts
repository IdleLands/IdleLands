import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Guilded extends Achievement {

  static readonly statWatches = ['Guild/Donate/Resource/Gold'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a personality (Supporter Of The Cause) for being in a guild and donating at least one gold.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.guildName ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Personality, personality: 'SupporterOfTheCause' }
    ];

    return baseRewards;
  }
}
