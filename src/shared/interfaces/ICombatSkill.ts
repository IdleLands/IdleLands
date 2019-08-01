import { ICombatCharacter, ICombat } from './ICombat';
import { Stat } from './Stat';

export interface ICombatWeightedSkillChoice {
  skills: ICombatSkillCombinator[][] | SkillCombinatorFunction;
  weight?: number;
  canUse?: (caster: ICombatCharacter, combat: ICombat) => boolean;
}

export type SkillCombinatorFunction =
  (combat: ICombat, caster: ICombatCharacter) => ICombatSkillCombinator[][];

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

  immediate?: boolean;
}

export interface ICombatSkill {
  targets: number[];
  targetEffects: { [id: string]: ICombatSkillEffect[] };
}

// passed through each combat
export type PartialCombatSkill = {
  [P in keyof ICombatSkill]?: ICombatSkill[P];
};
