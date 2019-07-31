import { ICombat, PartialCombatSkill, ICombatCharacter } from '../../interfaces';

export const CombatEffect =
  (miscEffect: (combat: ICombat) => void) =>
    (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

      miscEffect(combat);

      return skill;
    };
