import { Stat } from './Stat';
import { ICombatSkillEffect } from './ICombatSkill';

export interface ICombatCharacter {
  combatId: number;
  combatPartyId: number;

  name: string;
  level: number;
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
  seed: number;
  chance: any;
  currentRound: number;
  characters: { [id: string]: ICombatCharacter };
  parties: ICombatParty[];
}
