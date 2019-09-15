
import { Chance } from 'chance';
import { clamp } from 'lodash';
import { Singleton, AutoWired } from 'typescript-ioc';

@Singleton
@AutoWired
export class RNGService {

  // to seed this: https://github.com/chancejs/chancejs/issues/371
  private _chance = new Chance();
  public get chance() {
    return this._chance;
  }

  public id() {
    return this.chance.guid();
  }

  public numberInRange(min: number, max: number): number {
    return this.chance.integer(this.clampMinAtMax({ min, max }));
  }

  public clampMinAtMax({ min, max }): { min: number, max: number } {
    if(min < max) return { min, max };
    return { min: max, max: max };
  }

  public pickone<T = any>(items: T[]): T {
    if(!items || items.length === 0) return null;
    return this.chance.pickone(items);
  }

  public picksome<T = any>(items: T[], qty: number): T[] {
    if(items.length === 0) return null;
    return this.chance.pickset(items, qty);
  }

  public likelihood(percent = 50): boolean {
    return this.chance.bool({ likelihood: clamp(percent, 0, 100) });
  }

  public weighted(items: any[], weights: number[]): any {
    return this.chance.weighted(items, weights);
  }

  public weightedFromLootastic(items: Array<{ result: any, chance: number }>): any {
    return this.weighted(items.map(x => x.result), items.map(x => x.chance));
  }

}
