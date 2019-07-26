import { ICombatCharacter, ICombat } from './ICombat';
import { Stat } from './Stat';

export type ICombatSkillCombinator =
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat) => PartialCombatSkill;

export type InternalCombatSkillFunction =
  (caster: ICombatCharacter, target: ICombatCharacter, combat: ICombat) => number;

export interface ICombatSkillEffect {
  accuracy: number;
  desc: string;
  source: number;
  modifyStat: Stat;
  modifyStatValue: number;
  turnsUntilEffect: number;
  turnsEffectLasts: number;
}

export interface ICombatSkill {
  targets: number[];
  targetEffects: { [id: string]: ICombatSkillEffect[] };
}

// passed through each combat
export type PartialCombatSkill = {
  [P in keyof ICombatSkill]?: ICombatSkill[P];
};
