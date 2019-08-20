import { AchievementType, AchievementRewardType, Stat, Achievement, PermanentUpgrade } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Taskmaster extends Achievement {

  static readonly base = 5;

  static readonly statWatches = ['Quest/Personal/Total'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 2} XP for completing ${Math.pow(Taskmaster.base, tier).toLocaleString()} personal quests.`;

    if(tier >= 3) {
      baseStr = `${baseStr} +1 Max Quests.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Master of Tasks.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Quest/Personal/Total');
    return Math.floor(Achievement.log(steps, Taskmaster.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Stats, stats: {
        [Stat.XP]: (tier * 2)
       } }
    ];

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.MaxQuestsCapBoost]: 1 } });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Master of Tasks' });
    }

    return baseRewards;
  }
}
