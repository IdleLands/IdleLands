import { Stat } from './Stat';
import { PermanentUpgrade } from './IPremium';

export interface IBuff {
  name: string;
  statistic: string;
  duration: number;
  booster?: boolean;
  stats?: { [key in Stat]?: number };
  permanentStats?: { [key in PermanentUpgrade]?: number };
}
