import { ICombatCharacter, ICombat } from './ICombat';
import { Stat } from './Stat';

export type ICombatSkillCombinator = (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat) => PartialCombatSkill;

export interface ICombatSkillEffect {
  accuracy: number;
  modifyStat: Stat;
  modifyStatValue: number;
  turnsUntilEffect: number;
  turnsEffectLasts: number;
}

export interface ICombatSkill {
  desc: string;

  cost: number;
  costStat: Stat;

  targets: number[];
  targetEffects: { [id: string]: ICombatSkillEffect[] };
}

// passed through each combat
export type PartialCombatSkill = {
  [P in keyof ICombatSkill]?: ICombatSkill[P];
};
