import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const Delay = () => (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
  return skill;
};
