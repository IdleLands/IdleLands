import { Personality } from '../../../../shared/interfaces';

export class Leader extends Personality {
  static description = 'You will lead parties, but will not join one.';
  static statMultipliers = { };
  static toggleOff = ['Follower'];
}
