
export interface IQuest {
  id: string;
  name: string;
  objectives: IQuestObjective[];

  turnInMap?: string;
  turnInRegion?: string;
}

export interface IQuestObjective {
  desc: string;
  scalar: number;
  statistic: string;
  statisticValue: number;

  progress: number;

  requireMap?: string;
  requireRegion?: string;
  requireCollectible?: string;
}
