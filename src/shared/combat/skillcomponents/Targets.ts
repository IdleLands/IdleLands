import { PartialSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const Targetting = {
  Self: (caster, combat) => caster
};

export const Targets = () => (skill: PartialSkill, caster: ICombatCharacter, combat: ICombat): PartialSkill => {
  return skill;
};
