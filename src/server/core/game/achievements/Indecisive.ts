import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Indecisive extends Achievement {

  static readonly base = 5000;

  static readonly statWatches = ['Character/Choose/Personality/Indecisive'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title, +2 Choice Log Size and and +2 base XP for just not caring many times.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Choose/Personality/Indecisive');
    return steps >= Indecisive.base ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.ChoiceLogSizeBoost]: 2 } },
      { type: AchievementRewardType.Stats, stats: { [Stat.XP]: 2 } },
      { type: AchievementRewardType.Title, title: 'Whatever-Dude' }
    ];

    return baseRewards;
  }
}
