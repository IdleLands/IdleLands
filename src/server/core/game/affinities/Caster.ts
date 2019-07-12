import { BaseAffinity } from '../professions/Profession';
import { Stat } from '../../../../shared/interfaces';

export class Caster extends BaseAffinity {
  public readonly statForStats: { [key in Stat]?: { [key2 in Stat]?: number } } = {
    [Stat.HP]: {
      [Stat.CON]: 2
    }
  };

  public readonly statMultipliers: { [key in Stat]?: number } = {
    [Stat.HP]:  0.5,
    [Stat.STR]: 0.5,
    [Stat.DEX]: 1,
    [Stat.INT]: 5,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 2,

    [Stat.XP]:   1,
    [Stat.GOLD]: 2
  };

  public readonly statsPerLevel: { [key in Stat]?: number } = {
    [Stat.HP]:  2,
    [Stat.STR]: 0,
    [Stat.DEX]: 1,
    [Stat.INT]: 3,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 2,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };
}
