import { Personality } from '../../../../shared/interfaces';

export class Indecisive extends Personality {
  static description = 'All incoming choices will have their default action set randomly.';
  static toggleOff = ['Affirmer', 'Denier'];
}
