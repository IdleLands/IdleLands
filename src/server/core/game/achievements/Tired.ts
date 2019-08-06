import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Tired extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Character/Stamina/Spend'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier} Adventure Log Capacity
                   and +${tier * 2} Max Stamina for using ${Math.pow(Tired.base, tier).toLocaleString()} stamina.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Exhausted.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Stamina/Spend');
    return Math.floor(Achievement.log(steps, Tired.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.AdventureLogSizeBoost]: tier } },
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.MaxStaminaBoost]: tier * 2 } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Exhausted' });
    }

    return baseRewards;
  }
}
