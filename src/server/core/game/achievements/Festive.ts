import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Festive extends Achievement {

  static readonly base = 5;

  static readonly statWatches = ['Game/Premium/ILP/FestivalSpend'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    let baseStr = `Gain +${tier} achievement(s) for spending ${Math.pow(Festive.base, tier).toLocaleString()} ILP on festivals.`;

    // 625 (2-4 festivals)
    if(tier >= 4) {
      baseStr = `${baseStr} +1 Adventure Log Size.`;
      baseStr = `${baseStr} +1 Inventory Size.`;
    }

    // 3,125 (10-20 festivals)
    if(tier >= 5) {
      baseStr = `${baseStr} +1 Item Stat Cap.`;
      baseStr = `${baseStr} +5 Max Stamina.`;
    }

    // 15,625 (48-105 festivals)
    if(tier >= 6) {
      baseStr = `${baseStr} +1 Choice Log Size.`;
      baseStr = `${baseStr} +1 Enchant Cap.`;
      baseStr = `${baseStr} Title: Festive Fox.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const steps = player.$statistics.get('Game/Premium/ILP/FestivalSpend');
    return Math.floor(Achievement.log(steps, Festive.base));
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [];

    if(tier >= 4) {
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.AdventureLogSizeBoost]: 1 } });
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.InventorySizeBoost]: 1 } });
    }

    if(tier >= 5) {
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.ItemStatCapBoost]: 1 } });
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.MaxStaminaBoost]: 1 } });
    }

    if(tier >= 6) {
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.ChoiceLogSizeBoost]: 1 } });
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.EnchantCapBoost]: 1 } });
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Festive Fox' });
    }

    return baseRewards;
  }
}
