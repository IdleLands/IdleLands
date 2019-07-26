import { PartialCombatSkill, ICombatCharacter, ICombat, Stat } from '../../interfaces';

export const EffectsPerTarget = (times: number) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
    if(!skill.targets || skill.targets.length === 0) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to EffectsPerTarget but has no targets.`);
    }

    skill.targetEffects = skill.targetEffects || {};

    skill.targets.forEach(target => {
      skill.targetEffects[target] = skill.targetEffects[target] || [];
      for(let i = 0; i < times; i++) {
        skill.targetEffects[target].push({
          accuracy: 0,
          desc: '',
          modifyStat: null,
          modifyStatValue: 0,
          turnsUntilEffect: 0,
          turnsEffectLasts: 0
        });
      }
    });

    return skill;
  };
