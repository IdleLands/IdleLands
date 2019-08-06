import { Personality, Stat } from '../../../../shared/interfaces';

export class Dextrous extends Personality {
  static description = 'Whenever you find an item that has a DEX that exceeds your own item, you equip it automatically. DEX + 5%.';
  static statMultipliers = { [Stat.DEX]: 1.05 };
  static toggleOff = ['Intelligent', 'Strong', 'Lucky', 'Fortuitous', 'Agile'];
}
