import { Stat } from './Stat';
import { ICombatSkillEffect } from './ICombatSkill';

export interface ICombatCharacter {
  combatId?: number;
  combatPartyId?: number;

  name: string;
  realName?: string;
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
  ante?: { [id: string]: { gold: number, xp: number } };
  characters: { [id: string]: ICombatCharacter };
  parties: { [id: string]: ICombatParty };
}
