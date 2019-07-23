import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const LastingEffect = () => (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
  return skill;
};
