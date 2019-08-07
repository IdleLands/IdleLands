import { Personality } from '../../../../shared/interfaces';

export class Telesheep extends Personality {
  static description = 'When you join a party, you will teleport to the leader. You will follow the leader within 5 tiles.';
  static statMultipliers = { };
  static toggleOff = [];
}
