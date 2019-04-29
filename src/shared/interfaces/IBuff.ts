import { Stat } from './Stat';

export interface IBuff {
  name: string;
  statistic: string;
  duration: number;
  stats: { [key in Stat]?: number };
}
