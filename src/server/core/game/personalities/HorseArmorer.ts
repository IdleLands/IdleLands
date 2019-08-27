import { Personality } from '../../../../shared/interfaces';

export class HorseArmorer extends Personality {
  static description = `Incoming items will first be given to pets if possible.
  Any replaced items will be permanently lost, because pets don\'t understand the value of a cool item.`;
  static toggleOff = [];
}
