import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class SoloStepper extends Achievement {

  static readonly statWatches = ['Character/Movement/Steps/Solo'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain a title and +5 max stamina for solo-stepping 100,000 times.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Title: Solo Scorpion.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Movement/Steps/Solo');
    if(steps >= 1000000) return 2;
    if(steps >= 100000) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.MaxStaminaBoost]: 5 } },
      { type: AchievementRewardType.Title, title: 'Sole Foot' }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Solo Scorpion' });
    }

    return baseRewards;
  }
}
