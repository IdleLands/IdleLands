import { Personality, Stat } from '../../../../shared/interfaces';

export class Greedy extends Personality {
  static description = 'Gain 15% more GOLD at the cost of 15% XP.';
  static statMultipliers = { [Stat.XP]: 0.85, [Stat.GOLD]: 1.15 };
  static toggleOff = ['Seeker'];
}
