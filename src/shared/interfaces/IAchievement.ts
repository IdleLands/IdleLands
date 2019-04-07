
export enum AchievementType {
  Progress = 'progress',
  Explore = 'explore',
  Combat = 'combat',
  Special = 'special',
  Event = 'event',
  Pet = 'pet'
}

export enum AchievementRewardType {
  Stats = 'stat#',
  StatMultipliers = 'stat%',
  PetAttribute = 'petattr',
  Title = 'title',
  DeathMessage = 'deathmsg'
}

export interface IAchievement {
  name: string;
  tier: number;
  desc: string;
  achievedAt: number;
  type: AchievementType;

  rewards: any[];
}
