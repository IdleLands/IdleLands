import { Singleton, AutoWired } from 'typescript-ioc';

import * as AllProfessions from './professions';
import { Profession } from './professions/Profession';

@Singleton
@AutoWired
export class ProfessionHelper {
  public getProfession(prof: string): Profession {
    return new AllProfessions[prof]();
  }

  public hasProfession(prof: string): boolean {
    return AllProfessions[prof];
  }
}
