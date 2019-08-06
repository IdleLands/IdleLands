import { Personality } from '../../../../shared/interfaces';

export class Solo extends Personality {
  static description = 'You will politely (or not-so-politely) decline all party invites.';
  static statMultipliers = { };
  static toggleOff = [];
}
