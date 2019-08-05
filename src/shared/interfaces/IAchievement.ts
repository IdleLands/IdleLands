import { Stat } from './Stat';
import { IPlayer } from './IPlayer';

export enum AchievementType {
  Progress = 'progress',
  Explore = 'explore',
  Combat = 'combat',
  Special = 'special',
  Event = 'event',
  Pet = 'pet'
}

export enum AchievementRewardType {
  Gender = 'gender',
  Stats = 'stat#',
  StatMultipliers = 'stat%',
  Pet = 'pet',
  PetAttribute = 'petattr',
  Title = 'title',
  DeathMessage = 'deathmsg',
  Personality = 'personality',
  PermanentUpgrade = 'permanentupgrade'
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

  static readonly statWatches: string[];
  static readonly type: AchievementType = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    return `Error: no desc for ach`;
  }

  static calculateTier(player: IPlayer): number {
    return 1;
  }

  static rewardsForTier(tier: number): IAchievementReward[] {
    return [];
  }

  static log(num: number, base: number): number {
    // hard return case for situations where you have a stat at 0
    if(num === 0) return 0;

    return +parseFloat(
      (Math.log(num) / Math.log(base)).toString()
    ).toPrecision(1);
  }
}
