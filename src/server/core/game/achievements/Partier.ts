import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Partier extends Achievement {

  static readonly statWatches = ['Character/Movement/Steps/Party'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain three personalities (Solo, Leader, Follower) for party-stepping 10,000 times.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Title: Synergistic. Personality: Telesheep. +5 max stamina.`;
    }

    if(tier >= 3) {
      baseStr = `${baseStr} Title: Party Parakeet.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Movement/Steps/Party');
    if(steps >= 1000000) return 3;
    if(steps >= 100000) return 2;
    if(steps >= 10000) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Personality, personality: 'Solo' },
      { type: AchievementRewardType.Personality, personality: 'Leader' },
      { type: AchievementRewardType.Personality, personality: 'Follower' }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.MaxStaminaBoost]: 5 } });
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Telesheep' });
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Synergistic' });
    }

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Party Parakeet' });
    }

    return baseRewards;
  }
}
