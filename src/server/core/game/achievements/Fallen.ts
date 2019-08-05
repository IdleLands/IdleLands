import { AchievementType, AchievementRewardType, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Fallen extends Achievement {

  static readonly base = 5000;

  static readonly statWatches = ['Character/Movement/Fall'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title for falling. A lot.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Movement/Fall');
    return steps >= Fallen.base ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Fallen' }
    ];

    return baseRewards;
  }
}
