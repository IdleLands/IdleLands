import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Frail extends Achievement {

  static readonly base = 4;

  static readonly statWatches = ['Character/Injury/Receive'];
  static readonly type = AchievementType.Combat;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier}% CON for receiving ${Math.pow(Frail.base, tier).toLocaleString()} injuries.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Spooky Skeleton. Injury Cap +1.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Injury/Receive');
    return Math.floor(Achievement.log(steps, Frail.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: { [Stat.CON]: 1 + (tier * 0.01) } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Spooky Skeleton' });
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.InjuryThreshold]: 1 } });
    }

    return baseRewards;
  }
}
