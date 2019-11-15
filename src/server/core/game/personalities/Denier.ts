import { Personality } from '../../../../shared/interfaces';

export class Denier extends Personality {
  static description = 'All incoming choices will automatically be denied with the "No" action.';
  static toggleOff = ['Affirmer', 'Indecisive', 'Fancypants'];
}
