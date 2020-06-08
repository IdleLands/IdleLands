import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Colorful extends Achievement {

  static readonly statWatches = ['BossKill/Total'];
  static readonly type = AchievementType.Special;

static descriptionForTier(tier: number): string {
    let baseStr = `You found a colored egg behind a rock. `;
    let rewardStr = `Title: Egg.`;

    if(tier >= 2) {
      baseStr = `${baseStr}You also found a chocolate egg in a tree branch. `;
      rewardStr = `${rewardStr} Choice log size +1`;
    }

    if(tier >= 3) {
      baseStr = `You followed the Easter Bunny to his hole and stole all his colored chocolate eggs. `;
      rewardStr = `Choice log size +1, titles: Egg, Colorful.`;
    }
    return `${baseStr} ${rewardStr}`;
  }

  static calculateTier(player: Player): number {
    const coll1 = player.$collectibles.has('Striped Colored Egg');
    const coll2 = player.$collectibles.has('Ceramic Egg');
    const coll3 = player.$collectibles.has('Fungal Egg');
    const coll4 = player.$collectibles.has('Pastel Red Egg');
    const kill = player.$statistics.get('BossKill/Boss/Eggman');

    const multi = coll1 && coll2 && coll3 && coll4 && kill ? 1 : 0;
    const steps = (multi * kill);

    if(steps >= 7) return 3;
    if(steps >= 3) return 2;
    if(steps >= 1) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Egg' }
    ];

    if(tier >= 2) {
      baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.ChoiceLogSizeBoost]: 1 } });
    }

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Colorful' });
    }

    return baseRewards;
  }
}
