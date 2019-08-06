import { Personality } from '../../../../shared/interfaces';

export class Follower extends Personality {
  static description = 'You will join parties, but will not lead one.';
  static statMultipliers = { };
  static toggleOff = ['Leader'];
}
