import { Stat } from './Stat';

export interface IBuff {
  name: string;
  statistic: string;
  duration: number;
  booster?: boolean;
  stats: { [key in Stat]?: number };
}
