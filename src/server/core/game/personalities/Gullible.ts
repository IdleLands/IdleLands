import { Personality } from '../../../../shared/interfaces';

export class Gullible extends Personality {
  static description = 'Become the best form of yourself';
  static statMultipliers = { };
  static toggleOff = [
    'Affirmer', 'Camping', 'Delver', 'Denier',
    'Drunk', 'Greedy', 'Gullible', 'Indecisive', 'ScaredOfTheDark',
    'Seeker', 'Solo'
  ];
}
