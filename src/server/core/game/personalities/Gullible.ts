import { Personality } from '../../../../shared/interfaces';

export class Gullible extends Personality {
  static description = 'Become the best form of yourself';
  static statMultipliers = { };
  static toggleOff = [
    'Affirmer', 'Agile', 'Autoscender', 'Camping', 'Delver', 'Denier', 'Dextrous',
    'Drunk', 'Follower', 'Fortuitous', 'Greedy', 'Gullible', 'Indecisive', 'Intelligent', 'Leader', 'Lucky',
    'Restless', 'ScaredOfTheDark', 'Seeker', 'Solo', 'Strong', 'Telesheep'
  ];
}
