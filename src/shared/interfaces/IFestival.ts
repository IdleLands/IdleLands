import { Stat } from './Stat';

export enum FestivalChannelOperation {

  // used when a festival is added
  Add,

  // used when a festival is removed
  Remove
}

export interface IFestival {
  id?: string;
  name: string;
  endTime: number;
  startedBy: string;
  stats: { [key in Stat]?: number };
}

export enum FestivalType {
  XP = 'XP',
  Gold = 'Gold',
  CoreStats = 'CoreStats'
}

const FESTIVAL_STAT_MULT = 20;

export const FestivalStats: { [key in FestivalType]: { [stat in Stat]?: number } } = {
  [FestivalType.CoreStats]: {
    [Stat.STR]: FESTIVAL_STAT_MULT, [Stat.AGI]: FESTIVAL_STAT_MULT, [Stat.CON]: FESTIVAL_STAT_MULT,
    [Stat.DEX]: FESTIVAL_STAT_MULT, [Stat.INT]: FESTIVAL_STAT_MULT, [Stat.LUK]: FESTIVAL_STAT_MULT
  },
  [FestivalType.XP]: { [Stat.XP]: FESTIVAL_STAT_MULT },
  [FestivalType.Gold]: { [Stat.GOLD]: FESTIVAL_STAT_MULT }
};

export const FestivalCost: { [key in FestivalType]: number } = {
  [FestivalType.CoreStats]: 50,
  [FestivalType.XP]: 70,
  [FestivalType.Gold]: 90
};
