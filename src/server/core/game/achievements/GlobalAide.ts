import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class GlobalAide extends Achievement {

  static readonly statWatches = ['Quest/Global/FirstPlace'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title and +1 Quest Log Size for taking first place in a global quest.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Quest/Global/FirstPlace');
    return steps ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.MaxQuestsCapBoost]: 1 } },
      { type: AchievementRewardType.Title, title: 'Global Aide' }
    ];

    return baseRewards;
  }
}
