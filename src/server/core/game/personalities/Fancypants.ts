import { Personality } from '../../../../shared/interfaces';

export class Fancypants extends Personality {
  static description = `You will automatically purchase items, double down on gambling events,
 and sell found items. Any Yes/No choices will be be chosen randomly`;
  static statMultipliers = { };
  static toggleOff = ['Affirmer', 'Indecisive', 'Denier'];
}
