import { PartialSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const Description = (desc: string) => (skill: PartialSkill, caster: ICombatCharacter, combat: ICombat): PartialSkill => {
  skill.desc = desc;
  return skill;
};
