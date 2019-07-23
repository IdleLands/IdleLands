import { PartialSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const StatScale = () => (skill: PartialSkill, caster: ICombatCharacter, combat: ICombat): PartialSkill => {
  return skill;
};
