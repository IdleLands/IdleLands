
export enum AdventureDuration {
  VeryShort = 2,
  Short = 4,
  Medium = 8,
  Long = 16,
  VeryLong = 24
}

export enum AdventureType {
  /*
  Combat = 'combat',
  MerchantGuild = 'merchantguild',
  BossHunt = 'bosshunt',
  TimeTravel = 'timetravel',
  MagicalItemSearch = 'magicalitemsearch',
  EnhancementSearch = 'enhancementsearch',
  Adventure = 'adventure',
  AdventurersGraveyard = 'adventurersgraveyard'
  */
}

export interface IAdventure {
  name: string;
  duration: AdventureDuration;
}

export const GenerateRewardsForCategory: { [key in AdventureType]: Function } = {

};
