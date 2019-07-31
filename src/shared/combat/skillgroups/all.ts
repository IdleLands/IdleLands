
import { ICombatSkillCombinator, Stat, InternalCombatSkillFunction } from '../../interfaces';
import { Targetting, Description, Targets, EffectsPerTarget, Accuracy, StatMod } from '../skillcomponents';
import { RandomNumber } from '../skillcomponents/RandomNumber';

/**
 * These abilities are basic building blocks that don't really need to be repeated.
 */
export const Attack: () => ICombatSkillCombinator[] = () => [
  Targets(Targetting.SingleEnemy),
  EffectsPerTarget(1),
  Description('%source attacked %target for %value damage!'),
  Accuracy(90),
  StatMod(Stat.HP, RandomNumber(1, (attacker) => Math.floor(attacker.stats[Stat.STR])))
];

export const RegenerateHP: (val: number|InternalCombatSkillFunction) => ICombatSkillCombinator[] = (val) => [
  Targets(Targetting.Self),
  EffectsPerTarget(1),
  Description('%source regenerated %value health!'),
  Accuracy(100),
  StatMod(Stat.HP, val)
];
