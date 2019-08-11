import { BaseAffinity } from '../professions/Profession';
import { Stat } from '../../../../shared/interfaces';

export class None extends BaseAffinity {
  public readonly statForStats: { [key in Stat]?: { [key2 in Stat]?: number } } = {
    [Stat.HP]: {
      [Stat.CON]: 1
    }
  };

  public readonly statMultipliers: { [key in Stat]?: number } = {
    [Stat.HP]:  1,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 1,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel: { [key in Stat]?: number } = {
    [Stat.HP]:  1,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 1,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };
}
