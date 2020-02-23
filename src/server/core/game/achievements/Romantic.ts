import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Romantic extends Achievement {

  static readonly statWatches = ['BossKill/Total'];
  static readonly type = AchievementType.Special;

static descriptionForTier(tier: number): string {
    let baseStr = `You are rewarded with a title for getting shot with an arrow of Cupid.`;

    if(tier >= 2) {
      baseStr = `${baseStr} You also got a card from a secret admirer along with inventory size boost +1.`;
    }

    if(tier >= 3) {
      baseStr = `You've been shot with Cupid's arrow, got a card from a secret admirer and a kiss from your Valentine.`;
      baseStr = `${baseStr} Rewards: 2 titles, inventory size boost +1.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const coll1 = player.$collectibles.has('Arrow of Love');
    const coll2 = player.$collectibles.has('Vial of New Blood');
    const coll3 = player.$collectibles.has('Vial of Old Blood');
    const kill1 = player.$statistics.get('BossKill/Boss/Blood Ooze');
    const kill2 = player.$statistics.get('BossKill/Boss/The Bloodkeeper');
    const chest1 = player.$statistics.get('Treasure/Chest/Valentine Gear');

    const multi = coll1 && coll2 && coll3 && kill1 && kill2 && chest1 ? 1 : 0;
    const sum = ((kill1 + kill2 + chest1) / 3);
    const steps = (multi * sum);

    if(steps >= 7) return 3;
    if(steps >= 3) return 2;
    if(steps >= 1) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Romantic' }
    ];

    if(tier >= 2) {
     baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.InventorySizeBoost]: 1 } });
    }

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Cupid' });
    }

    return baseRewards;
  }
}
