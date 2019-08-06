import { Personality, Stat } from '../../../../shared/interfaces';

export class Strong extends Personality {
  static description = 'Whenever you find an item that has a STR that exceeds your own item, you equip it automatically. STR + 5%.';
  static statMultipliers = { [Stat.STR]: 1.05 };
  static toggleOff = ['Intelligent', 'Lucky', 'Fortuitous', 'Dextrous', 'Agile'];
}
