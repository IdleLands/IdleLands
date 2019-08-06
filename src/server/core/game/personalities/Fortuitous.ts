import { Personality, Stat } from '../../../../shared/interfaces';

export class Fortuitous extends Personality {
  static description = 'Whenever you find an item that has a CON that exceeds your own item, you equip it automatically. CON + 5%.';
  static statMultipliers = { [Stat.CON]: 1.05 };
  static toggleOff = ['Intelligent', 'Strong', 'Lucky', 'Dextrous', 'Agile'];
}
