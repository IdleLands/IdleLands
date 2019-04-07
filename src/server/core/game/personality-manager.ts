import { Singleton, AutoWired } from 'typescript-ioc';

import * as Personalities from './personalities';

@Singleton
@AutoWired
export class PersonalityManager {

  public get(name: string) {
    return Personalities[name];
  }

}
