import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Scrambler extends Achievement {

  static readonly base = 5000;

  static readonly statWatches = ['Character/Movement/Teleport'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title and pet attribute (Teleseer) for teleporting frequently.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Movement/Teleporter');
    return steps >= Scrambler.base ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Lover of Eggs' },
      { type: AchievementRewardType.PetAttribute, petattr: PetAttribute.Trueseer }
    ];

    return baseRewards;
  }
}
