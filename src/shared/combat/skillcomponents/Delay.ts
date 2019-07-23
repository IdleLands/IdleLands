import { PartialSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const Delay = () => (skill: PartialSkill, caster: ICombatCharacter, combat: ICombat): PartialSkill => {
  return skill;
};
