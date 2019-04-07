import { Stat } from './Stat';

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
  DeathMessage = 'deathmsg',
  Personality = 'personality'
}

export interface IAchievementReward {
  type: AchievementRewardType;

  personality?: string;
  title?: string;
  gender?: string;
  stats?: { [key in Stat]?: number };
  statMultipliers?: { [key in Stat]?: number };
}

export interface IAchievement {
  name: string;
  tier: number;
  desc: string;
  achievedAt: number;
  type: AchievementType;

  rewards: any[];
}

export abstract class Achievement {
  static base = 1;

  static log(num: number, base: number): number {
    return +parseFloat(
      (Math.log(num) / Math.log(base)).toString()
    ).toPrecision(1);
  }
}
