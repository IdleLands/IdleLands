import { ICombatCharacter, ICombat } from './ICombat';
import { Stat } from './Stat';

export type ISkillCombinator = (skill: PartialSkill, caster: ICombatCharacter, combat: ICombat) => PartialSkill;

export interface ISkillEffect {
  modifyStat: Stat;
  modifyStatValue: number;
  turnsUntilEffect: number;
  turnsEffectLasts: number;
}

export interface ISkill {
  desc: string;

  cost: number;
  costStat: Stat;

  targetEffects: { [id: string]: ISkillEffect[] };
}

// passed through each combat
export type PartialSkill = {
  [P in keyof ISkill]?: ISkill[P];
};
