import { Stat } from './Stat';
import { ICombatSkillEffect } from './ICombatSkill';

export interface ICombatCharacter {
  combatId?: number;
  combatPartyId?: number;
  summonerId?: number;

  name: string;
  ownerName?: string;
  realName?: string;
  specialName?: string;
  level: number;
  maxStats: { [key in Stat]?: number };
  stats: { [key in Stat]: number };

  effects?: Array<ICombatSkillEffect[]>;

  // specified for players
  profession?: string;

  // specified for pets
  affinity?: string;
  attribute?: string;
  rating?: number;
}

export interface ICombatParty {
  id: number;
  name: string;
}

export interface ICombat {
  name: string;
  timestamp?: number;
  seed?: number;
  chance?: any;
  currentRound?: number;
  ante?: { [id: string]: { gold: number, xp: number, items?: string[], collectibles?: string[], gachas?: string[] } };
  characters: { [id: string]: ICombatCharacter };
  parties: { [id: string]: ICombatParty };

  isRaid?: boolean;
}
