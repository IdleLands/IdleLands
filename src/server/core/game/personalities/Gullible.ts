import { Personality } from '../../../../shared/interfaces';

export class Gullible extends Personality {
  static description = 'Become the best form of yourself';
  static statMultipliers = { };
  static toggleOff = [
    'Affirmer', 'Agile', 'Camping', 'Delver', 'Denier', 'Dextrous',
    'Drunk', 'Greedy', 'Gullible', 'Indecisive', 'Intelligent', 'Leader', 'Lucky',
    'ScaredOfTheDark', 'Seeker', 'Solo', 'Strong', 'Telesheep'
  ];
}
