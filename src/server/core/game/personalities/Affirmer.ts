import { Personality } from '../../../../shared/interfaces';

export class Affirmer extends Personality {
  static description = 'All incoming choices will be set to "Yes" as their default action.';
  static toggleOff = ['Denier', 'Indecisive'];
}
