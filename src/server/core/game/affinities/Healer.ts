import { BaseAffinity } from '../professions/Profession';
import { Stat } from '../../../../shared/interfaces';

export class Healer extends BaseAffinity {

  public readonly specialStatName = 'Mana';

  public readonly statForStats: { [key in Stat]?: { [key2 in Stat]?: number } } = {
    [Stat.HP]: {
      [Stat.CON]: 3
    },
    [Stat.SPECIAL]: {
      [Stat.INT]: 10
    }
  };

  public readonly statMultipliers: { [key in Stat]?: number } = {
    [Stat.HP]:  1,
    [Stat.STR]: 0.5,
    [Stat.DEX]: 1,
    [Stat.INT]: 3,
    [Stat.CON]: 3,
    [Stat.AGI]: 2,
    [Stat.LUK]: 2,

    [Stat.SPECIAL]: 1,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel: { [key in Stat]?: number } = {
    [Stat.HP]:  4,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 3,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]: 20,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };
}
