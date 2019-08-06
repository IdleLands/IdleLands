import { Personality } from '../../../../shared/interfaces';

export class Camping extends Personality {
  static description = 'You will take a break and go camping, not moving until you stop.';
  static statMultipliers = { };
  static toggleOff = [];
}
