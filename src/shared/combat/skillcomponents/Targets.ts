import { PartialCombatSkill, ICombatCharacter, ICombat, Stat } from '../../interfaces';

export enum Targetting {
  Self,
  Anyone,
  SingleAlly,
  SingleEnemy,
  AllAllies,
  AllEnemies,
  All
}

const NotDead = (char: ICombatCharacter) => char.stats[Stat.HP] > 0;

const TargettingFunctions: { [key in Targetting]: (caster: ICombatCharacter, combat: ICombat) => ICombatCharacter[] } = {
  [Targetting.Self]:        (caster, combat) => [caster],

  [Targetting.Anyone]:      (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(NotDead)
                                                )],

  [Targetting.SingleEnemy]: (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x !== caster)
                                                  .filter(NotDead)
                                                )],

  [Targetting.SingleAlly]:  (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId === caster.combatPartyId)
                                                  .filter(NotDead)
                                                )],

  [Targetting.AllEnemies]:  (caster, combat) => Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId !== caster.combatPartyId)
                                                  .filter(NotDead),

  [Targetting.AllAllies]:   (caster, combat) => Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId === caster.combatPartyId)
                                                  .filter(NotDead),

  [Targetting.All]:         (caster, combat) => Object.values(combat.characters)
                                                  .filter(NotDead)
};

export const NumberOfTargets: (f: Targetting, caster, combat) => number =
  (func: Targetting, caster, combat) => TargettingFunctions[func](caster, combat).length;

export const Targets = (targetFunc: Targetting) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
    skill.targets = TargettingFunctions[targetFunc](caster, combat).map(x => x.combatId);
    return skill;
  };
