
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

export interface IGlobalQuest extends IQuest {
  endsAt: number;
  objectives: IGlobalQuestObjective[];
  claimedBy: { [player: string]: boolean };
  rewards: { first: string[], second: string[], third: string[], other: string[] };
}

export interface IGlobalQuestObjective extends IQuestObjective {
  contributions: { [player: string]: number };
}

export enum QuestAction {
  QuestUpdate,
  AddQuest,
  RemoveQuest
}
