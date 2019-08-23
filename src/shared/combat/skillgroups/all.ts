
import { max as lmax } from 'lodash';

import { ICombatSkillCombinator, Stat, InternalCombatSkillFunction, ICombat, ICombatCharacter, PetAffinity } from '../../interfaces';
import { Targetting, Description, Targets, EffectsPerTarget, Accuracy, StatMod, AttackAccuracy } from '../skillcomponents';
import { RandomNumber } from '../skillcomponents/RandomNumber';

/**
 * These abilities are basic building blocks that don't really need to be repeated.
 */
export const Attack: (
  min?: number|InternalCombatSkillFunction,
  max?: number|InternalCombatSkillFunction,
  acc?: number|AttackAccuracy
) => ICombatSkillCombinator[] =
  (
    min = 1,
    max = (attacker) => Math.floor(attacker.stats[Stat.STR]),
    acc = AttackAccuracy.STR
  ) => [
    Targets(Targetting.SingleEnemy),
    EffectsPerTarget(1),
    Description('%source attacked %target for %value damage!'),
    Accuracy(acc),
    StatMod(Stat.HP, RandomNumber(min, max))
  ];

export const RegenerateHP: (val: number|InternalCombatSkillFunction) => ICombatSkillCombinator[] =
  (val) => [
    Targets(Targetting.Self),
    EffectsPerTarget(1),
    Description('%source regenerated %value health!'),
    Accuracy(100),
    StatMod(Stat.HP, val)
  ];

export const RegenerateSpecial: (val: number|InternalCombatSkillFunction, silent?: boolean) => ICombatSkillCombinator[] =
  (val, silent = false) => [
    Targets(Targetting.Self),
    EffectsPerTarget(1),
    Description(silent ? '' : '%source regenerated %value %special!'),
    Accuracy(100),
    StatMod(Stat.SPECIAL, val)
  ];

export const SummonCreature = (statMuliplier: number = 1) =>
  (combat: ICombat, caster: ICombatCharacter) => {

    const stats = Object.assign({ }, caster.stats);
    Object.keys(stats).forEach(stat => stats[stat] = Math.floor(stats[stat] * statMuliplier));

    const maxStats = Object.assign({ }, stats);

    const newCreature: ICombatCharacter = {
      name: `${combat.chance.name()} (${caster.name}'s Summon)`,
      level: caster.level,
      stats,
      maxStats,

      combatId: lmax(Object.keys(combat.characters).map(x => +x)) + 1,
      combatPartyId: caster.combatPartyId,
      summonerId: caster.combatId,
      affinity: combat.chance.pickone(Object.values(PetAffinity))
    };

    combat.characters[newCreature.combatId] = newCreature;
  };
