
export enum AdventureDuration {
  VeryShort = 2,
  Short = 4,
  Medium = 8,
  Long = 16,
  VeryLong = 24
}

export enum AdventureRewardCategory {

}

export interface IAdventure {
  name: string;
  duration: AdventureDuration;
}

export const GenerateRewardsForCategory: { [key in AdventureRewardCategory]: Function } = {

};
