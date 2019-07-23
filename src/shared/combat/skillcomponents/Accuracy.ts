import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const Accuracy = () => (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
  return skill;
};
