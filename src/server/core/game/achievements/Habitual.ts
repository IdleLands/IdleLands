import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Habitual extends Achievement {

  static readonly base = 7;

  static readonly statWatches = ['Astral Gate/Roll/Free'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier}% Item Cap Boost rolling Free Gate ${(tier * Habitual.base).toLocaleString()} days.`;

    if(tier >= 4) {
      baseStr = `${baseStr} Title: Monthly Roller.`;
    }

    if(tier >= 13) {
      baseStr = `${baseStr} Title: Quarterly Roller.`;
    }

    if(tier >= 26) {
      baseStr = `${baseStr} Title: Halfly Roller.`;
    }

    if(tier >= 52) {
      baseStr = `${baseStr} Title: Yearly Roller.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Astral Gate/Roll/Free');
    return Math.floor(steps / Habitual.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.ItemStatCapBoost]: tier } }
    ];

    if(tier >= 4) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Monthly Roller' });
    }

    if(tier >= 13) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Quarterly Roller' });
    }

    if(tier >= 26) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Halfly Roller' });
    }

    if(tier >= 52) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Yearly Roller' });
    }

    return baseRewards;
  }
}
