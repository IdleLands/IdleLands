
import { Chance } from 'chance';
import { Singleton, AutoWired } from 'typescript-ioc';

@Singleton
@AutoWired
export class RNGService {

  // to seed this: https://github.com/chancejs/chancejs/issues/371
  private _chance = new Chance();
  public get chance() {
    return this._chance;
  }

  public numberInRange(min: number, max: number): number {
    return this.chance.integer(this.clampMinAtMax({ min, max }));
  }

  public clampMinAtMax({ min, max }): { min: number, max: number } {
    if(min < max) return { min, max };
    return { min: max, max: max };
  }

  public pickone<T = any>(items: T[]): T {
    if(items.length === 0) return null;
    return this.chance.pickone(items);
  }

  public picksome<T = any>(items: T[], qty: number): T[] {
    if(items.length === 0) return null;
    return this.chance.picksome(items, qty);
  }

  public likelihood(percent = 50): boolean {
    return this.chance.bool({ likelihood: percent });
  }

  public weighted(items: any[], weights: number[]): any {
    return this.chance.weighted(items, weights);
  }

}
