
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

}
