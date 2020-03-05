import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Shamrocked extends Achievement {

  static readonly statWatches = ['BossKill/Boss/Big Small Leprechaun'];
  static readonly type = AchievementType.Special;

static descriptionForTier(tier: number): string {
    let baseStr = `You think you found a four-leaf clover while roaming the woods drunk.`;
    let rewardStr = `Title: Shamrocked.`;

    if(tier >= 2) {
      baseStr = `${baseStr} You also saw a rainbow followed it to find a treasure at it's end.`;
      rewardStr = `+2% GOLD and title: Shamrocked.`;
    }

    if(tier >= 3) {
      baseStr = `You're convinced you found a four-leaf clover and treasure at the end of a rainbow`;
      baseStr = `${baseStr} in a drunken haze before being mugged by a leprechaun.`;
      rewardStr = `Gain 2 titles and +2% GOLD.`;
    }
    return `${baseStr} ${rewardStr}`;
  }

  static calculateTier(player: Player): number {
    const coll1 = player.$collectibles.has('Four Leaf Clover');
    const coll2 = player.$collectibles.has('Three Leaf Clover');
    const coll3 = player.$collectibles.has('Twenty Seven Leaf Clover');
    const coll4 = player.$collectibles.has('Five Leaf Clover');
    const kill = player.$statistics.get('BossKill/Boss/Big Small Leprechaun');

    const multi = coll1 && coll2 && coll3 && coll4 && kill ? 1 : 0;
    const steps = (multi * kill);

    if(steps >= 7) return 3;
    if(steps >= 3) return 2;
    if(steps >= 1) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Shamrocked' }
    ];

    if(tier >= 2) {
     baseRewards.push({ type: AchievementRewardType.StatMultipliers, stats: {
        [Stat.GOLD]: 1.02
      } });
    }

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Leprechaun' });
    }

    return baseRewards;
  }
}
