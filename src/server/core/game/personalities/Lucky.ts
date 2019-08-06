import { Personality, Stat } from '../../../../shared/interfaces';

export class Lucky extends Personality {
  static description = 'Whenever you find an item that has a LUK that exceeds your own item, you equip it automatically. LUK + 5%.';
  static statMultipliers = { [Stat.LUK]: 1.05 };
  static toggleOff = ['Intelligent', 'Strong', 'Fortuitous', 'Dextrous', 'Agile'];
}
