import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const StatMod = () => (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
  return skill;
};
