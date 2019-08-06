import { Personality, Stat } from '../../../../shared/interfaces';

export class Intelligent extends Personality {
  static description = 'Whenever you find an item that has a INT that exceeds your own item, you equip it automatically. INT + 5%.';
  static statMultipliers = { [Stat.INT]: 1.05 };
  static toggleOff = ['Lucky', 'Strong', 'Fortuitous', 'Dextrous', 'Agile'];
}
