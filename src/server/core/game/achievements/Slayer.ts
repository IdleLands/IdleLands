import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Slayer extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Combat/All/Kill/Monster'];
  static readonly type = AchievementType.Combat;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 3}% STR/INT for killing ${Math.pow(Slayer.base, tier).toLocaleString()} monsters.`;

    if(tier >= 3) {
      baseStr = `${baseStr} Title: Culler of Herds.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Slayer of Beasts.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Combat/All/Kill/Monster');
    return Math.floor(Achievement.log(steps, Slayer.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.03),
        [Stat.INT]: 1 + (tier * 0.03)
       } }
    ];

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Culler of Herds' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Slayer of Beasts' });
    }

    return baseRewards;
  }
}
