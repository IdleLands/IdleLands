import { ICombat, PartialCombatSkill, ICombatCharacter } from '../../interfaces';

export const CombatEffect =
  (miscEffect: (combat: ICombat, caster: ICombatCharacter) => void) =>
    (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

      miscEffect(combat, caster);

      return skill;
    };
