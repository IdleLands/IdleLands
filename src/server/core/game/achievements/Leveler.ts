import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat, PetAttribute } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Leveler extends Achievement {

  static readonly base = 25;

  static readonly statWatches = ['Character/Experience/Levels'];
  static readonly type = AchievementType.Progress;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier * 5}% more XP and GOLD +1 Adventure Log Size for leveling ${tier * 25} time(s).`;

    const divisor = Math.floor(tier / 4);
    if(divisor > 0) {
      baseStr = `${baseStr} +${divisor * 25}% Item Stat Cap Boost.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.level.total / 25;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.XP]:   1 + (tier * 0.05),
        [Stat.GOLD]: 1 + (tier * 0.05)
      } },
      { type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.AdventureLogSizeBoost]: tier } }
    ];

    const divisor = Math.floor(tier / 4);
    if(divisor > 0) {
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.ItemStatCapBoost]: divisor * 25 } });
    }

    return baseRewards;
  }
}
