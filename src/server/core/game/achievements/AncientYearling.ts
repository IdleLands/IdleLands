import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class AncientYearling extends Achievement {

  static readonly statWatches = ['Game/IdleLands3/Anniversary'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title and +${tier * 10}% to all special stats for staying logged in for over a year! 🍻`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$statistics.get('Game/IdleLands3/Anniversary');
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.XP]: 1 + (tier * 0.1),
        [Stat.HP]: 1 + (tier * 0.1),
        [Stat.GOLD]: 1 + (tier * 0.1)
       } },
       { type: AchievementRewardType.Title, title: 'World Traveler 🌎' }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Seer of Moons 🌑' });
    }

    return baseRewards;
  }
}
