import { PartialCombatSkill, ICombatCharacter, ICombat, Stat, InternalCombatSkillFunction } from '../../interfaces';

export const StatMod = (stat: Stat, statMod: number|InternalCombatSkillFunction) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

    if(skill.targets.length === 0 || !skill.targetEffects) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to StatMod but has no targets.`);
    }

    Object.keys(skill.targetEffects).forEach(characterId => {
      skill.targetEffects[characterId].forEach(effect => {
        if(effect.modifyStat) return;

        effect.modifyStat = stat;
        effect.modifyStatValue = <number>statMod;

        if(statMod instanceof Function) {
          effect.modifyStatValue = statMod(caster, combat.characters[characterId], combat);
        }

      });
    });

    return skill;
  };
