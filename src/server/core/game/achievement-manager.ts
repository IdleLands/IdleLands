import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { compact } from 'lodash';

import * as Achievements from './achievements';
import { Player } from '../../../shared/models';
import { IAchievement, AchievementType, AchievementRewardType, IPetProto } from '../../../shared/interfaces';
import { AssetManager } from './asset-manager';

@Singleton
@AutoWired
export class AchievementManager {

  @Inject assets: AssetManager;

  private allAchievements: { [key: string]: any } = {};

  public statToAchievement: { [key: string]: any[] } = {};

  public init() {
    Object.keys(Achievements).forEach(achievementName => {
      const ach = Achievements[achievementName];
      this.allAchievements[achievementName] = ach;

      if(!ach.statWatches) return;

      ach.statWatches.forEach(stat => {
        this.statToAchievement[stat] = this.statToAchievement[stat] || [];
        this.statToAchievement[stat].push(ach);
      });
    });

    const allPetAchievements = this.getAllPetAchievements();
    allPetAchievements.forEach(petAch => {
      this.allAchievements[petAch.name] = petAch;

      petAch.statWatches.forEach(stat => {
        this.statToAchievement[stat] = this.statToAchievement[stat] || [];
        this.statToAchievement[stat].push(petAch);
      });
    });
  }

  private getAllPetAchievements() {
    const allPets = Object.values(this.assets.allPetAssets);

    return allPets.map((pet: IPetProto) => {
      return {
        name: `Tribal: ${pet.typeName}`,
        statWatches: Object.keys(pet.requirements.statistics),
        type: AchievementType.Pet,
        descriptionForTier: () => `You earned a new pet: ${pet.typeName}.
          It offers the following permanent bonuses for ${pet.cost.toLocaleString()} gold:
          ${Object.keys(pet.permanentUpgrades).map(x => `${x} +${pet.permanentUpgrades[x]}`).join(', ')}`,
        calculateTier: () => 1,
        rewardsForTier: () => [{ type: AchievementRewardType.Pet, pet: pet.typeName }]
      };
    });
  }

  private getAchievementObject(player: Player, achName: string, alwaysGet = false): IAchievement {
    const ach = this.allAchievements[achName];

    const tier = ach.calculateTier(player);
    if(tier === 0) return;

    const existingTier = alwaysGet ? 0 : player.$achievements.getAchievementTier(ach.name);
    if(tier === existingTier) return;

    const existingAchAt = alwaysGet ? player.$achievements.getAchievementAchieved(ach.name) : 0;

    const achObj: IAchievement = {
      name: ach.name,
      achievedAt: existingAchAt || Date.now(),
      tier,
      desc: ach.descriptionForTier(tier),
      type: ach.type,
      rewards: ach.rewardsForTier(tier)
    };

    return achObj;
  }

  public checkAchievementsFor(player: Player, stat?: string): IAchievement[] {
    if(stat && !this.statToAchievement[stat]) return [];

    const newAchievements = [];

    const checkArr = stat ? this.statToAchievement[stat] : Object.values(this.allAchievements);

    checkArr.forEach(ach => {
      const achObj = this.getAchievementObject(player, ach.name);
      if(!achObj) return;

      newAchievements.push(achObj);

      player.$achievements.add(achObj);
    });

    return newAchievements;
  }

  public syncAchievements(player: Player): void {
    const allEarnedAchievements = compact(
      Object.values(this.allAchievements).map(ach => this.getAchievementObject(player, ach.name, true))
    );
    player.$achievements.resetAchievementsTo(allEarnedAchievements);
  }

}
