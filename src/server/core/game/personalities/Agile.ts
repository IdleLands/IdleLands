import { Personality, Stat } from '../../../../shared/interfaces';

export class Agile extends Personality {
  static description = 'Whenever you find an item that has a AGI that exceeds your own item, you equip it automatically. AGI + 5%.';
  static statMultipliers = { [Stat.AGI]: 1.05 };
  static toggleOff = ['Intelligent', 'Strong', 'Lucky', 'Dextrous', 'Fortuitous'];
}
