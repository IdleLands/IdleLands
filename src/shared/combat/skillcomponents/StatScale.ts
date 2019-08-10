import { PartialCombatSkill, ICombatCharacter, ICombat, InternalCombatSkillFunction } from '../../interfaces';

export const StatScale = (scaleMod: number|InternalCombatSkillFunction) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

    if(!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to StatScale but has no targets. Combat: ${JSON.stringify(combat)}`);
    }

    Object.keys(skill.targetEffects).forEach(characterId => {
      skill.targetEffects[characterId].forEach(effect => {

        if(scaleMod instanceof Function) {
          effect.modifyStatValue = scaleMod(caster, combat.characters[characterId], combat);
        } else {
          effect.modifyStatValue = Math.floor(effect.modifyStatValue * scaleMod);
        }

      });
    });

    return skill;
  };
