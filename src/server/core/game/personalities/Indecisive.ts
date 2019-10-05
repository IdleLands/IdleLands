import { Personality } from '../../../../shared/interfaces';

export class Indecisive extends Personality {
  static description = 'All incoming choices will automatically be chosen randomly.';
  static toggleOff = ['Affirmer', 'Denier'];
}
