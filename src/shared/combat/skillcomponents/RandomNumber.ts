import { ICombatCharacter, ICombat, InternalCombatSkillFunction } from '../../interfaces';

export const RandomNumber =
  (minEval: number|InternalCombatSkillFunction, maxEval: number|InternalCombatSkillFunction, isPositive?: boolean) =>
    (caster: ICombatCharacter, target: ICombatCharacter, combat: ICombat): number => {

      let min = minEval;
      if(minEval instanceof Function) {
        min = minEval(caster, target, combat);
      }

      let max = maxEval;
      if(maxEval instanceof Function) {
        max = maxEval(caster, target, combat);
      }

      if(max < min) max = min;

      return Math.floor(combat.chance.integer({ min, max })) * (isPositive ? 1 : -1);
    };
