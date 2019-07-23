
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { PermanentUpgrade, PremiumTier, PremiumScale, ItemClass, GachaReward, TeleportItemLocation, IBuffScrollItem, AllStatsButSpecial, StatPartners } from '../../interfaces';

import * as Gachas from '../../../shared/astralgate';
import { Player } from './Player.entity';
import { EventName } from '../../../server/core/game/events/Event';

@Entity()
export class Premium extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private ilp: number;

  @Column()
  private premiumTier: PremiumTier;

  @Column()
  private upgradeLevels: { [key in PermanentUpgrade]?: number };

  @Column()
  private gachaFreeRolls: { [key: string]: number };

  public get $premiumData() {
    return { ilp: this.ilp, tier: this.premiumTier, upgradeLevels: this.upgradeLevels, gachaFreeRolls: this.gachaFreeRolls };
  }

  constructor() {
    super();
    if(!this.ilp) this.ilp = 0;
    if(!this.premiumTier) this.premiumTier = PremiumTier.None;
    if(!this.upgradeLevels) this.upgradeLevels = {};
    if(!this.gachaFreeRolls) this.gachaFreeRolls = {};
  }

  hasILP(ilp: number): boolean {
    return this.ilp >= ilp;
  }

  gainILP(ilp: number) {
    this.ilp += ilp;
  }

  spendILP(ilp: number) {
    this.ilp -= ilp;
    this.ilp = Math.max(this.ilp, 0);
  }

  buyUpgrade(upgrade: PermanentUpgrade): boolean {
    if(!PremiumScale[upgrade]) return false;

    const curLevel = this.getUpgradeLevel(upgrade);
    const cost = Math.pow(PremiumScale[upgrade], curLevel + 1);

    if(!this.hasILP(cost)) return false;
    this.upgradeLevels[upgrade] = this.upgradeLevels[upgrade] || 0;
    this.upgradeLevels[upgrade]++;

    this.spendILP(cost);
    return true;
  }

  getUpgradeLevel(upgrade: PermanentUpgrade): number {
    return this.upgradeLevels[upgrade] || 0;
  }

  getNextFreeRoll(gachaName: string) {
    return this.gachaFreeRolls[gachaName] || 0;
  }

  public validateAndEarnGachaRewards(player: Player, rewards: string[]): any[] {
    rewards = this.validateRewards(player, rewards);
    this.earnGachaRewards(player, rewards);

    return rewards;
  }

  doGachaRoll(player: Player, gachaName: string, numRolls = 1): false|any[] {
    if(!Gachas[gachaName]) return false;

    const gacha = new Gachas[gachaName]();
    if(!gacha.canRoll(player, numRolls)) return false;

    if(gacha.canRollFree(player)) {
      this.gachaFreeRolls[gacha.name] = gacha.getNextGachaFreeInterval();
      player.increaseStatistic('Astral Gate/Roll/Free', 1);
    } else {
      gacha.spendCurrency(player, numRolls);
      player.increaseStatistic('Astral Gate/Roll/Currency', 1);
    }

    player.increaseStatistic(`Astral Gate/Gates/${gacha.name}`, 1);

    let rewards = [];
    for(let i = 0; i < numRolls; i++) {
      rewards.push(gacha.roll());
    }

    rewards = this.validateAndEarnGachaRewards(player, rewards);

    return rewards;
  }

  private validateRewards(player: Player, rewards: string[]): string[] {

    const { creatures, items } = player.$$game.assetManager.allBossAssets;
    const randomBoss = player.$$game.rngService.pickone(Object.keys(creatures));
    const boss = player.level.total >= creatures[randomBoss].stats.level ? creatures[randomBoss] : null;

    return rewards.map(reward => {

      // we can't get the same collectible twice if we have it
      if(reward.includes('collectible')) {
        const [x, sub, color] = reward.split(':');

        if(sub === 'Soul' && player.$collectibles.hasCurrently(`Pet Soul: ${color}`)) return `item:Crystal:${color}`;

        if(sub === 'guardian') {
          if(!boss || !boss.collectibles || !boss.collectibles.length) return `xp:player:sm`;
          return `collectible:guardian:${randomBoss}`;
        }

        if(sub === 'historical') {
          const collectibles = player.$collectibles.getUnfoundOwnedCollectibles();
          if(collectibles.length === 0) return 'xp:player:max';
          const chosenName = player.$$game.rngService.pickone(collectibles).name;
          return `collectible:historical:${chosenName}`;
        }
      }

      if(reward === GachaReward.GuardianItem) {
        if(!boss || !boss.items || !boss.items.length) return `xp:player:sm`;
        return `item:guardian:${boss.items[0].name}`;
      }

      if(reward === GachaReward.ItemTeleportScrollRandom) {
        const towns = ['Norkos Town', 'Maeles Town', 'Vocalnus Town', 'Frigri Town'];

        const otherTowns = ['Raburro Town', 'Homlet Town', 'Astral Town'];
        otherTowns.forEach(town => {
          if(!player.$statistics.get(`Map/${town}`)) return;
          towns.push(town);
        });

        const chosenLocation = player.$$game.rngService.pickone(towns);
        return `item:teleportscroll:${chosenLocation}`;
      }

      return reward;
    });
  }

  private earnGachaRewards(player: Player, rewards: string[]): void {
    const { creatures, items } = player.$$game.assetManager.allBossAssets;

    rewards.forEach(reward => {
      const [main, sub, choice] = reward.split(':');

      switch(main) {
        case 'xp': {
          const xpGained = {
            sm:  (char) => Math.floor(char.xp.maximum * 0.01),
            md:  (char) => Math.floor(char.xp.maximum * 0.05),
            lg:  (char) => Math.floor(char.xp.maximum * 0.10),
            max: (char) => Math.floor(char.xp.maximum)
          };

          if(sub === 'player') {
            player.gainXP(xpGained[choice](player));
          }

          if(sub === 'pet') {
            player.$pets.$activePet.gainXP(xpGained[choice](player.$pets.$activePet));
          }

          break;
        }

        case 'gold': {
          const goldEarned = { sm: 1000, md: 10000, lg: 100000 };
          player.gainGold(goldEarned[choice]);
          break;
        }

        case 'collectible': {
          if(sub === 'Soul') {
            player.tryFindCollectible({
              name: `Pet Soul: ${choice}`,
              rarity: ItemClass.Goatly,
              description: `A floating ball of... pet essence? Perhaps you can tame this ${choice} soul.`,
              storyline: `Lore: Astral Gate`
            });
          }

          if(sub === 'guardian') {
            const collectible = creatures[choice].collectibles[0];
            player.tryFindCollectible({
              name: collectible.name,
              rarity: ItemClass.Guardian,
              description: collectible.flavorText,
              storyline: collectible.storyline
            });
          }

          if(sub === 'historical') {
            player.$collectibles.refindCollectible(choice);
          }
          break;
        }

        case 'event': {
          player.$$game.eventManager.doEventForPlayer(player, choice);
          break;
        }

        case 'item': {
          if(sub === 'Crystal') {
            player.$pets.addAscensionMaterial(`Crystal${choice}`);
          }

          if(sub === 'teleportscroll') {
            player.$inventory.addTeleportScroll(<TeleportItemLocation>choice);
          }

          if(sub === 'generated') {
            const generatedItem = player.$$game.itemGenerator.generateItem({ forceClass: choice });
            player.$$game.eventManager.doEventFor(player, EventName.FindItem, { fromPet: true, item: generatedItem });
          }

          if(sub === 'guardian') {
            const item = items[choice];
            const generatedItem = player.$$game.itemGenerator.generateGuardianItem(player, choice, item.type, item);
            player.$$game.eventManager.doEventFor(player, EventName.FindItem, { fromGuardian: true, item: generatedItem });
          }

          if(sub === 'buffscroll') {

            const stats = {};

            const chooseAndAddStat = () => {

              const stat = player.$$game.rngService.pickone(AllStatsButSpecial);
              const val = Math.floor(player.getStat(StatPartners[stat]) / 10);

              stats[stat] = stats[stat] || 0;
              stats[stat] += val;
            };

            chooseAndAddStat();
            if(player.$$game.rngService.likelihood(50)) chooseAndAddStat();
            if(player.$$game.rngService.likelihood(25)) chooseAndAddStat();

            const scroll: IBuffScrollItem = {
              id: player.$$game.rngService.id(),
              name: player.$$game.assetManager.scroll(),
              stats,
              expiresAt: Date.now() + (259200 * 1000) // 3 days in seconds * 1000
            };

            player.$inventory.addBuffScroll(scroll);
          }

          break;
        }

      }
    });
  }
}
