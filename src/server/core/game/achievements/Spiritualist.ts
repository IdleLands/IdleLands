import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Spiritualist extends Achievement {

  static readonly statWatches = ['Pet/Upgrade/Times'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title for upgrading all of the ghostly pets.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    if(!player.$petsData) return 0;
    
    const pets = player.$petsData.allPets;
    if(!pets['Spellbook'] || !pets['Ghostly Sword'] || !pets['Ghostly Shield']) return 0;

    return pets['Spellbook'].rating === 5
        && pets['Ghostly Sword'].rating === 5
        && pets['Ghostly Shield'].rating === 5
      ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Spiritualist' }
    ];

    return baseRewards;
  }
}
