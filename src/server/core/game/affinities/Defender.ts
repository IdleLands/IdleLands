import { BaseAffinity } from '../professions/Profession';
import { Stat } from '../../../../shared/interfaces';

export class Defender extends BaseAffinity {
  public readonly statForStats: { [key in Stat]?: { [key2 in Stat]?: number } } = {
    [Stat.HP]: {
      [Stat.CON]: 25,
      [Stat.STR]: 10
    },
  };

  public readonly statMultipliers: { [key in Stat]?: number } = {
    [Stat.HP]:  3,
    [Stat.STR]: 0.5,
    [Stat.DEX]: 2,
    [Stat.INT]: 0.5,
    [Stat.CON]: 2,
    [Stat.AGI]: 2,
    [Stat.LUK]: 1,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel: { [key in Stat]?: number } = {
    [Stat.HP]:  20,
    [Stat.STR]: 0,
    [Stat.DEX]: 1,
    [Stat.INT]: 0,
    [Stat.CON]: 3,
    [Stat.AGI]: 2,
    [Stat.LUK]: 1,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };
}
