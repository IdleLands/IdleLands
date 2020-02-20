import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Hardcore extends Achievement {

  static readonly statWatches = ['Game/Hardcore'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title and +250% HP for playing as a Hardcore character.  Good luck, dude.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$statistics.get('Game/Hardcore') ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.HP]: 1 + (tier * 2.5)
      } },
      { type: AchievementRewardType.Title, title: 'Hardcore' }
    ];

    return baseRewards;
  }
}
