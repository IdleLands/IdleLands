import { BaseAffinity } from '../professions/Profession';
import { Stat } from '../../../../shared/interfaces';

export class Attacker extends BaseAffinity {
  public readonly statForStats: { [key in Stat]?: { [key2 in Stat]?: number } } = {
    [Stat.HP]: {
      [Stat.CON]: 5
    }
  };

  public readonly statMultipliers: { [key in Stat]?: number } = {
    [Stat.HP]:  2,
    [Stat.STR]: 1.1,
    [Stat.DEX]: 1,
    [Stat.INT]: 1,
    [Stat.CON]: 1.5,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel: { [key in Stat]?: number } = {
    [Stat.HP]:  10,
    [Stat.STR]: 3,
    [Stat.DEX]: 2,
    [Stat.INT]: 1,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };
}
