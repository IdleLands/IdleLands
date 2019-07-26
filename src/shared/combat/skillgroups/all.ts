
import { ICombatSkillCombinator, Stat } from '../../interfaces';
import { Targetting, Description, Targets, EffectsPerTarget, Accuracy, StatMod } from '../skillcomponents';
import { RandomNumber } from '../skillcomponents/RandomNumber';

/**
 * All combatants have these abilities.
 */
export const Attack: ICombatSkillCombinator[] = [
  Targets(Targetting.SingleEnemy),
  EffectsPerTarget(1),
  Description('%source attacked %target for %value damage!'),
  Accuracy(90),
  StatMod(Stat.HP, RandomNumber(1, (attacker) => Math.floor(attacker.stats[Stat.STR])))
];
