import { PartialCombatSkill, ICombatCharacter, ICombat, Stat } from '../../interfaces';

type DelayFunction = (caster: ICombatCharacter, target: ICombatCharacter) => number;

export const Delay = (delay: number|DelayFunction) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

    if(skill.targets.length === 0 || !skill.targetEffects) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to Delay but has no targets.`);
    }

    Object.keys(skill.targetEffects).forEach(characterId => {
      skill.targetEffects[characterId].forEach(effect => {

        effect.turnsUntilEffect = <number>delay;

        if(delay instanceof Function) {
          effect.turnsUntilEffect = delay(caster, combat.characters[characterId]);
        }

      });
    });

    return skill;
  };
