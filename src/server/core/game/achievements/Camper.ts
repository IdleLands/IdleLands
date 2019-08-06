import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Camper extends Achievement {

  static readonly statWatches = ['Character/Movement/Steps/Camping'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain a title for camp-sleeping 100,000 times.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Title: Camping Camel.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Movement/Steps/Camping');
    if(steps >= 1000000) return 2;
    if(steps >= 100000) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Happy Camper' }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Camping Camel' });
    }

    return baseRewards;
  }
}
