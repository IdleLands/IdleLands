import { PartialCombatSkill, ICombatCharacter, ICombat, InternalCombatSkillFunction } from '../../interfaces';

export const DelayScale = (scaleMod: number|InternalCombatSkillFunction) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

    if(!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to DelayScale but has no targets.`);
    }

    Object.keys(skill.targetEffects).forEach(characterId => {
      skill.targetEffects[characterId].forEach(effect => {

        if(scaleMod instanceof Function) {
          effect.turnsUntilEffect = scaleMod(caster, combat.characters[characterId], combat);
        } else {
          effect.turnsUntilEffect = Math.floor(effect.turnsUntilEffect * scaleMod);
        }

      });
    });

    return skill;
  };
