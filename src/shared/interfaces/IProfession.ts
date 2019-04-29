import { IPlayer } from './IPlayer';
import { Stat } from './Stat';

export interface IProfession {
  readonly specialStatName: string;
  readonly oocAbilityName: string;
  readonly oocAbilityDesc: string;
  readonly oocAbilityCost: number;

  readonly statForStats: { [key in Stat]?: { [key2 in Stat]?: number } };
  readonly statMultipliers: { [key in Stat]?: number };
  readonly statsPerLevel: { [key in Stat]?: number };

  $professionData: any;

  oocAbility(player: IPlayer): string;
  calcLevelStat(player: IPlayer, stat: Stat): number;
  calcStatMultiplier(stat: Stat): number;
  calcStatsForStats(stats: { [key in Stat]: number }, chosenStat: Stat): Array<{ stat: Stat, boost: number, tinyBoost: number }>;
}
