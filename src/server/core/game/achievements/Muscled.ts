import { AchievementType, AchievementRewardType, Stat, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Muscled extends Achievement {

  static readonly base = 10;

  static readonly statWatches = ['Item/Equip/Times'];
  static readonly type = AchievementType.Event;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% STR for equipping ${Math.pow(Muscled.base, tier).toLocaleString()} items.`;

    if(tier >= 2) {
      baseStr = `${baseStr} Personality: Strong.`;
    }

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Strong-armed Sparkler.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Item/Equip/Times');
    return Math.floor(Achievement.log(steps, Muscled.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.STR]: 1 + (tier * 0.05)
       } }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'Strong' });
    }

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Personality, personality: 'HorseArmorer' });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Strong-armed Sparkler' });
    }

    return baseRewards;
  }
}
