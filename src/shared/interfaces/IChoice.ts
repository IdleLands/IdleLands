
export interface IChoice {
  id: string;
  foundAt: number;

  desc: string;
  choices: string[];
  defaultChoice: string;

  event: string;

  extraData?: any;

  init(opts: PartialChoice);
}

export type PartialChoice = {
  [P in keyof IChoice]?: IChoice[P];
};
