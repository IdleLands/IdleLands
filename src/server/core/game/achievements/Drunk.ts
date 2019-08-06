import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Drunk extends Achievement {

  static readonly statWatches = ['Character/Movement/Steps/Drunk'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain a title and +5 max stamina for drunk-stepping 100,000 times.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Title: Lush Lemming.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Movement/Steps/Drunk');
    if(steps >= 1000000) return 2;
    if(steps >= 100000) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.MaxStaminaBoost]: 5 } },
      { type: AchievementRewardType.Title, title: 'Drunk' }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Lush Lemming' });
    }

    return baseRewards;
  }
}
