import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class BoosterSeat extends Achievement {

  static readonly base = 3;

  static readonly statWatches = ['Character/Booster/Give'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier}% STR for giving ${Math.pow(BoosterSeat.base, tier).toLocaleString()} buffs out.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Booster Seat. Buff Scroll Duration +1h. Pet Attribute (Alchemist).`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Character/Booster/Give');
    return Math.floor(Achievement.log(steps, BoosterSeat.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: { [Stat.STR]: 1 + (tier * 0.01) } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Exhausted' });
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.BuffScrollDuration]: 1 } });
      baseRewards.push({ type: AchievementRewardType.PetAttribute, petattr: PetAttribute.Alchemist });
    }

    return baseRewards;
  }
}
