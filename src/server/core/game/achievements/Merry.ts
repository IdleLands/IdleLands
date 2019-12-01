import { AchievementType, AchievementRewardType, Achievement, PermanentUpgrade, Stat } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class Merry extends Achievement {

  static readonly statWatches = ['Item/Collectible/Find'];
  static readonly type = AchievementType.Explore;

static descriptionForTier(tier: number): string {
    let baseStr = `You were given the gift of a title for joining the spirit of Winter.`;

    if(tier >= 2) {
      baseStr = `You were given the gift of a title and +1 Adventure Log Size for joining the spirit of Winter.`;
    }

    if(tier >= 3) {
      baseStr = `${baseStr} You even get an extra title for being so good this year.`;
    }

    return baseStr;
  }

  static calculateTier(player: Player): number {
    const coll1 = player.$collectibles.has('Wooden Toy');
    const coll2 = player.$collectibles.has('Elf Shoe');
    const coll3 = player.$collectibles.has('Sleigh Bell');
    const coll4 = player.$collectibles.has('Reindeer Hoof');
    const kill1 = player.$statistics.get('BossKill/Boss/Toy Maker Elf');
    const kill2 = player.$statistics.get('BossKill/Boss/Reindeer Warden');
    const kill3 = player.$statistics.get('BossKill/Boss/Santa, Lord of Presents');
    const chest1 = player.$statistics.get('Treasure/Chest/Christmas Gear');

    const multi = coll1 && coll2 && coll3 && coll4 && kill1 && kill2 && kill3 && chest1 ? 1 : 0;
    const sum = ((kill1 + kill2 + kill3 + chest1) / 4);
    const steps = (multi * sum);

    if(steps >= 7) return 3;
    if(steps >= 3) return 2;
    if(steps >= 1) return 1;
    return 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
      { type: AchievementRewardType.Title, title: 'Merry' }
    ];

    if(tier >= 2) {
     baseRewards.push({ type: AchievementRewardType.PermanentUpgrade, upgrades: { [PermanentUpgrade.AdventureLogSizeBoost]: 1 } });
    }

    if(tier >= 3) {
      baseRewards.push({ type: AchievementRewardType.Title, title: 'Little Helper' });
    }

    return baseRewards;
  }
}
