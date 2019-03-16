
import { get } from 'lodash';

import { Stat } from '../interfaces/Stat';
import { Player } from '../models/entity';

export class Profession {

  public readonly specialStatName: string;
  public readonly oocAbilityName: string;
  public readonly oocAbilityDesc: string;
  public readonly oocAbilityCost: number;

  protected readonly statForStats: { [key in Stat]?: { [key2 in Stat]?: number } } = {
    [Stat.HP]: {
      [Stat.CON]: 1
    }
  };

  protected readonly statMultipliers: { [key in Stat]: number } = {
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

  protected readonly statsPerLevel: { [key in Stat]: number } = {
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

  public get $professionData() {
    return {
      oocAbilityDesc: this.oocAbilityDesc,
      oocAbilityName: this.oocAbilityName,
      oocAbilityCost: this.oocAbilityCost
    };
  }

  public oocAbility(player: Player): string {
    return '';
  }

  public calcLevelStat(player: Player, stat: Stat) {
    return player.level.total * this.statsPerLevel[stat];
  }

  public calcStatMultiplier(stat: Stat) {
    return this.statMultipliers[stat];
  }

  public calcStatsForStats(stats: { [key in Stat]: number }, chosenStat: Stat): Array<{ stat: Stat, boost: number, tinyBoost: number }> {
    const baseBoosts = this.statForStats[chosenStat];
    if(!baseBoosts) return [];

    return Object.keys(baseBoosts).map((boostedStat: Stat) => {
      return {
        stat: boostedStat,
        boost: stats[boostedStat] * baseBoosts[boostedStat],
        tinyBoost: baseBoosts[boostedStat]
      };
    });
  }

}
