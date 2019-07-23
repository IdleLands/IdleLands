import { Stat } from './Stat';

export interface ICombatCharacter {
  combatId: number;
  combatPartyId: number;

  name: string;
  level: number;
  stats: { [key in Stat]: number };

  // specified for players
  profession?: string;

  // specified for pets
  affinity?: string;
  attribute?: string;
}

export interface ICombatParty {
  id: number;
  name: string;
}

export interface ICombat {
  seed: number;
  chance: any;
  characters: ICombatCharacter[];
  parties: ICombatParty[];
}
