import { AchievementType, AchievementRewardType, Achievement, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Bossy extends Achievement {

  static readonly base = 25;

  static readonly statWatches = ['BossKill/Total'];
  static readonly type = AchievementType.Combat;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 3}% CON/AGI for killing ${(tier * Bossy.base).toLocaleString()} bosses.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Personality: Seeker.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Bossy.`;
    }

    if(tier >= 15) {
      baseStr = `${baseStr} Gender: green boss monster.`;
    }

    if(tier >= 30) {
      baseStr = `${baseStr} Gender: blue boss monster.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('BossKill/Total');
    return Math.floor(steps / Bossy.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.CON]: 1 + (tier * 0.03),
        [Stat.AGI]: 1 + (tier * 0.03)
      } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Seeker' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Bossy' });
    }

    if(tier >= 15) {
      baseRewards.push({ type: AchievementRewardType.Gender, gender: 'green boss monster' });
    }

    if(tier >= 30) {
      baseRewards.push({ type: AchievementRewardType.Gender, gender: 'blue boss monster' });
    }

    return baseRewards;
  }
}
