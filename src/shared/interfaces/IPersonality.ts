import { Stat } from './Stat';

export interface IPersonality {
  init(opts: PartialPersonality);
}

export type PartialPersonality = {
  [P in keyof IPersonality]?: IPersonality[P];
};

export class Personality {
  static description = 'A generic personality';
  static statMultipliers: { [key in Stat]?: number };
  static toggleOff: string[];
}
