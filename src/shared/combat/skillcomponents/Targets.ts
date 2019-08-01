import { PartialCombatSkill, ICombatCharacter, ICombat, Stat } from '../../interfaces';

export enum Targetting {
  Self,
  InjuredSelf,
  Anyone,
  SingleAlly,
  SingleEnemy,
  InjuredAlly,
  InjuredEnemy,
  DeadAlly,
  DeadEnemy,
  AllAllies,
  AllEnemies,
  All,
  AllButSelf
}

const Dead = (char: ICombatCharacter) => char.stats[Stat.HP] <= 0;
const NotDead = (char: ICombatCharacter) => char.stats[Stat.HP] > 0;
const Injured = (char: ICombatCharacter) => char.stats[Stat.HP] < char.maxStats[Stat.HP];

const TargettingFunctions: { [key in Targetting]: (caster: ICombatCharacter, combat: ICombat) => ICombatCharacter[] } = {
  [Targetting.Self]:         (caster, combat) => [caster],

  [Targetting.InjuredSelf]:  (caster, combat) => [caster].filter(Injured),

  [Targetting.Anyone]:       (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(NotDead)
                                                )],

  [Targetting.SingleEnemy]:  (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId !== caster.combatPartyId)
                                                  .filter(NotDead)
                                                )],

  [Targetting.SingleAlly]:   (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId === caster.combatPartyId)
                                                  .filter(NotDead)
                                                )],

  [Targetting.InjuredEnemy]: (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId !== caster.combatPartyId)
                                                  .filter(Injured)
                                                )],

  [Targetting.InjuredAlly]:  (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId === caster.combatPartyId)
                                                  .filter(Injured)
                                                )],

  [Targetting.DeadEnemy]:    (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId !== caster.combatPartyId)
                                                  .filter(Dead)
                                                )],

  [Targetting.DeadAlly]:     (caster, combat) => [combat.chance.pickone(Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId === caster.combatPartyId)
                                                  .filter(Dead)
                                                )],

  [Targetting.AllEnemies]:   (caster, combat) => Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId !== caster.combatPartyId)
                                                  .filter(NotDead),

  [Targetting.AllAllies]:    (caster, combat) => Object.values(combat.characters)
                                                  .filter(x => x.combatPartyId === caster.combatPartyId)
                                                  .filter(NotDead),

  [Targetting.All]:          (caster, combat) => Object.values(combat.characters)
                                                  .filter(NotDead),

  [Targetting.AllButSelf]:   (caster, combat) => Object.values(combat.characters)
                                                  .filter(x => x !== caster)
                                                  .filter(NotDead)
};

export const NumberOfTargets: (f: Targetting, caster, combat) => number =
  (func: Targetting, caster, combat) => {
    try {
      return TargettingFunctions[func](caster, combat).length;
    } catch(e) {
      return 0;
    }
  };

export const Targets = (targetFunc: Targetting) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
    skill.targets = TargettingFunctions[targetFunc](caster, combat).map(x => x.combatId);
    return skill;
  };
