import { Singleton, AutoWired } from 'typescript-ioc';

import * as AllProfessions from './professions';
import { BaseProfession } from './professions/Profession';

@Singleton
@AutoWired
export class ProfessionHelper {
  public getProfession(prof: string): BaseProfession {
    return new AllProfessions[prof]();
  }

  public hasProfession(prof: string): boolean {
    return AllProfessions[prof];
  }
}
