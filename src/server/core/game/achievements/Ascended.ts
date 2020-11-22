import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Ascended extends Achievement {

  static readonly base = 30;

  static readonly statWatches = ['Character/Ascension/Times'];
  static readonly type = AchievementType.Progress;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% more XP and GOLD for ascending ${tier} time(s). Title: Ascended.`;

    if(tier >= 1) {
      baseStr = `${baseStr} Personality: Fancypants.`;
    }

    if(tier >= 3) {
      baseStr = `${baseStr} Personality: Autoscender.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Arisen.`;
    }

    if(tier >= 10) {
      baseStr = `${baseStr} Title: Rerisen.`;
    }

    if(tier >= 15) {
      baseStr = `${baseStr} Title: True.`;
    }

    if(tier >= 20) {
      baseStr = `${baseStr} Title: Truer.`;
    }

    if(tier >= 25) {
      baseStr = `${baseStr} Title: Truest.`;
    }

    if(tier >= 50) {
      baseStr = `${baseStr} Title: Ascended².`;
    }
    
    if(tier >= 100) {
      baseStr = `${baseStr} Title: Ascented.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.ascensionLevel;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Ascended' },
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.XP]:   1 + (tier * 0.05),
        [Stat.GOLD]: 1 + (tier * 0.05)
      } }
    ];

    if(tier >= 1) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Fancypants' });
    }

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Autoscender' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Arisen' });
    }

    if(tier >= 10) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Rerisen' });
    }

    if(tier >= 15) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'True' });
    }

    if(tier >= 20) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Truer' });
    }

    if(tier >= 25) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Truest' });
    }

    if(tier >= 50) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Ascended²' });
    }

    if(tier >= 100) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Ascented' });
    }

    return baseRewards;
  }
}
