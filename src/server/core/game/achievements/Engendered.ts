import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Engendered extends Achievement {

  static readonly base = 50;

  static readonly statWatches = ['Game/Logins'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title (Engendered) for having 50 genders.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$achievements.getGenders().length;
    return steps >= Engendered.base ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Engendered' }
    ];

    return baseRewards;
  }
}
