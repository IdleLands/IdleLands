import { Personality, Stat } from '../../../../shared/interfaces';

export class Salvager extends Personality {
  static description = 'You will automatically salvage all items instead of selling them. Gain +5% SALVAGE.';
  static statMultipliers = { [Stat.SALVAGE]: 0.05 };
  static toggleOff = [];
}
