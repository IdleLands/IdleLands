
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { PermanentUpgrade, PremiumTier, PremiumScale } from '../../interfaces';

import * as Gachas from '../../../shared/astralgate';
import { Player } from './Player.entity';

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

  doGachaRoll(player: Player, gachaName: string, numRolls = 1): false|any[] {
    if(!Gachas[gachaName]) return false;

    const gacha = new Gachas[gachaName]();
    if(!gacha.canRoll(player, numRolls)) return false;

    if(gacha.canRollFree(player)) {
      this.gachaFreeRolls[gacha.name] = gacha.getNextGachaFreeInterval();
    } else {
      gacha.spendCurrency(player, numRolls);
    }

    const rewards = [];
    for(let i = 0; i < numRolls; i++) {
      rewards.push(gacha.roll());
    }

    this.earnGachaRewards(rewards);

    return rewards;
  }

  getNextFreeRoll(gachaName: string) {
    return this.gachaFreeRolls[gachaName] || 0;
  }

  earnGachaRewards(rewards: string[]): void {

    console.log(rewards);
  }
}
