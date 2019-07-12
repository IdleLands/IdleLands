import { BaseAffinity } from '../professions/Profession';
import { Stat } from '../../../../shared/interfaces';

export class Buffer extends BaseAffinity {
  public readonly statForStats: { [key in Stat]?: { [key2 in Stat]?: number } } = {
    [Stat.HP]: {
      [Stat.CON]: 3
    }
  };

  public readonly statMultipliers: { [key in Stat]?: number } = {
    [Stat.HP]:  0.7,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 3,
    [Stat.CON]: 3,
    [Stat.AGI]: 1,
    [Stat.LUK]: 3,

    [Stat.XP]:   2,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel: { [key in Stat]?: number } = {
    [Stat.HP]:  5,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 2,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };
}
