import { Personality } from '../../../../shared/interfaces';

export class Affirmer extends Personality {
  static description = 'All incoming choices will automatically be accepted with the "Yes" action.';
  static toggleOff = ['Denier', 'Indecisive'];
}
