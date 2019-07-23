import { PartialSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const LastingEffect = () => (skill: PartialSkill, caster: ICombatCharacter, combat: ICombat): PartialSkill => {
  return skill;
};
