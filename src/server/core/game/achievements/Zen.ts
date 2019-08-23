import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Zen extends Achievement {

  static readonly statWatches = ['Map/Maeles Dungeon -1/Regions/Zen Garden'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const val = tier === 1 ? 100000 : 1000000;
    let baseStr = `Gain a title (Zen) for hanging out in the Zen Garden for ${(val).toLocaleString()} steps.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Title: Serene Spaghetti Noodle`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Map/Maeles Dungeon -1/Regions/Zen Garden');
    if(steps >= 1000000) return 2;
    if(steps >= 100000)  return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Zen' }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Serene Spaghetti Noodle' });
    }

    return baseRewards;
  }
}
