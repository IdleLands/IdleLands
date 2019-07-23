import { PartialSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const StatMod = () => (skill: PartialSkill, caster: ICombatCharacter, combat: ICombat): PartialSkill => {
  return skill;
};
