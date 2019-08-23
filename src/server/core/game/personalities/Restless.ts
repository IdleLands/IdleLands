import { Personality } from '../../../../shared/interfaces';

export class Restless extends Personality {
  static description = 'You will always use your stamina ability at twice the cost when your stamina is full.';
  static statMultipliers = { };
  static toggleOff = [];
}
