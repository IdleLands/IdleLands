import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class PetUpgrader extends Achievement {

  static readonly base = 5;

  static readonly statWatches = ['Pet/Upgrade/Times'];
  static readonly type = AchievementType.Pet;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier}% XP for upgrading your pets ${(tier * PetUpgrader.base).toLocaleString()} time(s).`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Infuser. Pet Mission Cap +1. Pet Attribute (Surging).`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Pet/Upgrade/Times');
    return Math.floor(steps / PetUpgrader.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: { [Stat.XP]: 1 + (tier * 0.01) } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Infuser' });
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.PetMissionCapBoost]: 1 } });
      baseRewards.push({ type: AchievementRewardType.PetAttribute, petattr: PetAttribute.Surging });
    }

    return baseRewards;
  }
}
