import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, PetAttribute, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class AnimalAdmiral extends Achievement {

  static readonly base = 4;

  static readonly statWatches = ['Pet/AbilityUses/Total'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 2}% STR for using pet abilities ${Math.pow(AnimalAdmiral.base, tier).toLocaleString()} times.`;

    if(tier >= 4) {
      baseStr = `${baseStr} Pet Attribute: Ferocious.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Animal Admiral.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Pet/AbilityUses/Total');
    return Math.floor(Achievement.log(steps, AnimalAdmiral.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.02)
       } },
    ];

    if(tier >= 4) {
      baseRewards.push({ type: AchievementRewardType.PetAttribute, petattr: PetAttribute.Ferocious });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Animal Admiral' });
    }

    return baseRewards;
  }
}
