import { PartialCombatSkill, ICombatCharacter, ICombat, Stat } from '../../interfaces';

type LastingEffectFunction = (caster: ICombatCharacter, target: ICombatCharacter) => number;

export const LastingEffect = (duration: number|LastingEffectFunction) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

    if(skill.targets.length === 0 || !skill.targetEffects) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to LastingEffect but has no targets.`);
    }

    Object.keys(skill.targetEffects).forEach(characterId => {
      skill.targetEffects[characterId].forEach(effect => {

        effect.turnsEffectLasts = <number>duration;

        if(duration instanceof Function) {
          effect.turnsEffectLasts = duration(caster, combat.characters[characterId]);
        }

      });
    });

    return skill;
  };
