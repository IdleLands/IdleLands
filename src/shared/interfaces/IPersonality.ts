
export interface IPersonality {
  init(opts: PartialPersonality);
}

export type PartialPersonality = {
  [P in keyof IPersonality]?: IPersonality[P];
};
