import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const Targetting = {
  Self: (caster, combat) => caster
};

export const Targets = () => (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
  return skill;
};
