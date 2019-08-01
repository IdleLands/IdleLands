import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const Immediate = () => (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

  if(!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
    throw new Error(`Skill ${JSON.stringify(skill)} is trying to Immediate but has no targets.`);
  }

  Object.keys(skill.targetEffects).forEach(characterId => {
    skill.targetEffects[characterId].forEach(effect => {
      effect.immediate = true;
    });
  });

  return skill;
};
