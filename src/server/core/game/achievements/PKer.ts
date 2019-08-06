import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class PKer extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Combat/All/Kill/Player'];
  static readonly type = AchievementType.Combat;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 3}% DEX/AGI for killing ${Math.pow(PKer.base, tier).toLocaleString()} players.`;

    if(tier >= 3) {
      baseStr = `${baseStr} Title: Killer of Players.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Slayer of Men (and Women).`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Combat/All/Kill/Player');
    return Math.floor(Achievement.log(steps, PKer.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.DEX]: 1 + (tier * 0.03),
        [Stat.AGI]: 1 + (tier * 0.03)
       } }
    ];

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Killer of Players' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Slayer of Men (and Women)' });
    }

    return baseRewards;
  }
}
