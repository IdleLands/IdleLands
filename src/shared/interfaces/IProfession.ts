import { IPlayer, ICharacter } from './IPlayer';
import { Stat } from './Stat';

export interface IAffinity {
  readonly statForStats: { [key in Stat]?: { [key2 in Stat]?: number } };
  readonly statMultipliers: { [key in Stat]?: number };
  readonly statsPerLevel: { [key in Stat]?: number };

  calcLevelStat(player: ICharacter, stat: Stat): number;
  calcStatMultiplier(stat: Stat): number;
  calcStatsForStats(stats: { [key in Stat]: number }, chosenStat: Stat): Array<{ stat: Stat, boost: number, tinyBoost: number }>;
}

export interface IAttribute {
  readonly oocAbilityName: string;
  readonly oocAbilityDesc: string;
  readonly oocAbilityCost: number;

  oocAbility(player: IPlayer): string;
}

export interface IProfession {
  readonly specialStatName: string;

  $professionData: { oocAbilityName: string, oocAbilityDesc: string, oocAbilityCost: number };
}
