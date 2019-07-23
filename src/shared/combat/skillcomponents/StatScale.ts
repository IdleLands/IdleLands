import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const StatScale = () => (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
  return skill;
};
