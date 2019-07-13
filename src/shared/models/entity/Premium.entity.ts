
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { PremiumTier } from '../../interfaces/IPremium';

@Entity()
export class Premium extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private ilp: number;

  @Column()
  private premiumTier: PremiumTier;

  public get $premiumData() {
    return { ilp: this.ilp, tier: this.premiumTier };
  }

  constructor() {
    super();
    if(!this.ilp) this.ilp = 0;
    if(!this.premiumTier) this.premiumTier = PremiumTier.None;
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
}
