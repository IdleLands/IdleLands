import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const EffectsPerTarget = (times: number) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {
    if(!skill.targets || skill.targets.length === 0) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to EffectsPerTarget but has no targets. Combat: ${JSON.stringify(combat)}`);
    }

    skill.targetEffects = skill.targetEffects || {};

    skill.targets.forEach(target => {
      skill.targetEffects[target] = skill.targetEffects[target] || [];
      for(let i = 0; i < times; i++) {
        skill.targetEffects[target].push({
          accuracy: 100,
          desc: '',
          source: caster.combatId,
          modifyStat: null,
          modifyStatValue: 0,
          turnsUntilEffect: 0,
          turnsEffectLasts: 0
        });
      }
    });

    return skill;
  };
