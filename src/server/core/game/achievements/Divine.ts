import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Divine extends Achievement {

  static readonly base = 5;

  static readonly statWatches = ['Character/Movement/Steps/Divine'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier} stamina for moving divinely ${Math.pow(Divine.base, tier).toLocaleString()} times.`;

    if(tier >= 6) {
      baseStr = `${baseStr} Title: Divine.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Movement/Steps/Divine');
    return Math.floor(Achievement.log(steps, Divine.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.MaxStaminaBoost]: tier } }
    ];

    if(tier >= 6) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Divine' });
    }

    return baseRewards;
  }
}
