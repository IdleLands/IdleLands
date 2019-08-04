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
