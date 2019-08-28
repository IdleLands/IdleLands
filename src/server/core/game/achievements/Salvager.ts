import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Salvager extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Item/Salvage/Times'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% Salvage for salvaging ${Math.pow(Salvager.base, tier).toLocaleString()} items.`;

    if(tier >= 3) {
      baseStr = `${baseStr} Personality: Salvager.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Salvager of Resources.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Item/Salvage/Times');
    return Math.floor(Achievement.log(steps, Salvager.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Stats, stats: {
        [Stat.SALVAGE]: (tier * 5)
       } }
    ];

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Salvager' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Salvager of Resources' });
    }

    return baseRewards;
  }
}
