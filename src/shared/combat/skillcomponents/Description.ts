import { PartialCombatSkill, ICombatCharacter, ICombat } from '../../interfaces';

export const Description = (desc: string) => (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

  if(!skill.targets || skill.targets.length === 0 || !skill.targetEffects) {
    throw new Error(`Skill ${JSON.stringify(skill)} is trying to Description but has no targets. Combat: ${JSON.stringify(combat)}`);
  }

  Object.keys(skill.targetEffects).forEach(characterId => {
    skill.targetEffects[characterId].forEach(effect => {
      effect.desc = desc;
    });
  });

  return skill;
};
