import { Personality } from '../../../../shared/interfaces';

export class Denier extends Personality {
  static description = 'All incoming choices will be set to "No" as their default action.';
  static toggleOff = ['Affirmer', 'Indecisive'];
}
