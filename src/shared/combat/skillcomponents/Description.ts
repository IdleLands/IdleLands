import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const Description = (desc: string) => (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
  skill.desc = desc;
  return skill;
};
