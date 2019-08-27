import { Personality } from '../../../../shared/interfaces';

export class Forager extends Personality {
  static description = `You will periodically gather from all of your pets, but when you sell items, they're worth 50% less.`;
  static toggleOff = [];
}
