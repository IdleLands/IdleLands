import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export enum Targetting {
  Self,
  Single,
  SingleEnemy,
  All
}

const TargettingFunctions: { [key in Targetting]: (caster: ICombatCharacter, combat: ICombat) => ICombatCharacter[] } = {
  [Targetting.Self]:        (caster, combat) => [caster],
  [Targetting.Single]:      (caster, combat) => [caster],
  [Targetting.SingleEnemy]: (caster, combat) => [caster],
  [Targetting.All]:         (caster, combat) => [caster]
};

export const Targets = (targets: Targetting) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
    return skill;
  };
