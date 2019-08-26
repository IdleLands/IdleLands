import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Adventurous extends Achievement {

  static readonly base = 500;

  static readonly statWatches = ['Pet/Adventure/Hours'];
  static readonly type = AchievementType.Explore;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% Item Stat Cap Boost for sending your pets on
                  ${(tier * Adventurous.base).toLocaleString()} hours of dangerous adventures.`;

    if(tier >= 5) {
      baseStr = `${baseStr} Title: Sender.`;
    }

    if(tier >= 10) {
      baseStr = `${baseStr} Title: Caller.`;
    }

    if(tier >= 15) {
      baseStr = `${baseStr} Title: Organizer.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Pet/Adventure/Hours');
    return Math.floor(steps / Adventurous.base);
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.ItemStatCapBoost]: tier * 5 } }
    ];

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Sender' });
    }

    if(tier >= 10) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Caller' });
    }

    if(tier >= 15) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Organizer' });
    }

    return baseRewards;
  }
}
