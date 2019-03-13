import { Profession } from './Profession';
import { Stat } from '../interfaces/Stat';

export class Generalist extends Profession {

  public readonly specialStatName: string;

  protected readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5
    }
  };

  protected readonly statMultipliers = {
    [Stat.HP]:  5,
    [Stat.STR]: 1.2,
    [Stat.DEX]: 0.8,
    [Stat.INT]: 1,
    [Stat.CON]: 2,
    [Stat.AGI]: 0.5,
    [Stat.LUK]: 2,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1.1,
    [Stat.GOLD]: 1
  };

  protected readonly statsPerLevel = {
    [Stat.HP]:  10,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 1,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };
}
