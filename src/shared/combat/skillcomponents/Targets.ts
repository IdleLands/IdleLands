import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export enum Targetting {
  Self,
  Anyone,
  SingleAlly,
  SingleEnemy,
  All
}

const TargettingFunctions: { [key in Targetting]: (caster: ICombatCharacter, combat: ICombat) => ICombatCharacter[] } = {
  [Targetting.Self]:        (caster, combat) => [caster],
  [Targetting.Anyone]:      (caster, combat) => [combat.chance.pickone(Object.values(combat.characters))],
  [Targetting.SingleEnemy]: (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x !== caster))],
  [Targetting.SingleAlly]:  (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId === caster.combatPartyId))],
  [Targetting.All]:         (caster, combat) => Object.values(combat.characters)
};

export const Targets = (targetFunc: Targetting) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
    skill.targets = TargettingFunctions[targetFunc](caster, combat).map(x => x.combatId);
    return skill;
  };
