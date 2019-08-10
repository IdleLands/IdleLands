import { PartialCombatSkill, ICombatCharacter, ICombat, Stat, InternalCombatSkillFunction } from '../../interfaces';

export const MaxStat = (stat: Stat, statMod: number|InternalCombatSkillFunction) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

    if(!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to MaxStat but has no targets. Combat: ${JSON.stringify(combat)}`);
    }

    Object.keys(skill.targetEffects).forEach(characterId => {
      skill.targetEffects[characterId].forEach(effect => {
        if(effect.modifyStat !== stat) return;

        let compareValue = <number>statMod;

        if(statMod instanceof Function) {
          compareValue = statMod(caster, combat.characters[characterId], combat);
        }

        effect.modifyStatValue = Math.max(compareValue, effect.modifyStatValue);

      });
    });

    return skill;
  };
