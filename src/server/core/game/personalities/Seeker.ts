import { Personality, Stat } from '../../../../shared/interfaces';

export class Seeker extends Personality {
  static description = 'Gain 15% more XP at the cost of 15% GOLD.';
  static statMultipliers = { [Stat.XP]: 1.15, [Stat.GOLD]: 0.85 };
  static toggleOff = ['Greedy'];
}
