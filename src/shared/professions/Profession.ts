import { Stat } from '../interfaces/Stat';
import { Player } from '../models/entity';

export class Profession {

  public readonly specialStatName: string;

  protected readonly statMultipliers = {
    [Stat.HP]:  1,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 1,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
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

  public calcLevelStat(player: Player, stat: Stat) {
    return player.level.total * this.statsPerLevel[stat];
  }

  public calcStatMultiplier(stat: Stat) {
    return this.statMultipliers[stat];
  }

}
