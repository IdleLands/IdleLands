import { PartialCombatSkill, ICombatCharacter, ICombat, InternalCombatSkillFunction } from '../../interfaces';

export const Delay = (delay: number|InternalCombatSkillFunction) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

    if(!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to Delay but has no targets. Combat: ${JSON.stringify(combat)}`);
    }

    Object.keys(skill.targetEffects).forEach(characterId => {
      skill.targetEffects[characterId].forEach(effect => {

        effect.turnsUntilEffect = <number>delay;

        if(delay instanceof Function) {
          effect.turnsUntilEffect = delay(caster, combat.characters[characterId], combat);
        }

      });
    });

    return skill;
  };
