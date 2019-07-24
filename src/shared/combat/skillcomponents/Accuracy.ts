import { PartialCombatSkill, ICombatCharacter, ICombat, Stat, InternalCombatSkillFunction } from '../../interfaces';

export enum AttackAccuracy {
  STR = 'str',
  INT = 'int'
}

const AttackAccuracyFunctions: { [key in AttackAccuracy]: InternalCombatSkillFunction } = {
  [AttackAccuracy.STR]: (caster, target) => caster.stats[Stat.STR] / target.stats[Stat.AGI] * 100,
  [AttackAccuracy.INT]: (caster, target) => caster.stats[Stat.INT] / target.stats[Stat.CON] * 100
};

export const Accuracy = (accuracy: AttackAccuracy|number) =>
  (skill: PartialCombatSkill, caster: ICombatCharacter, combat: ICombat): PartialCombatSkill => {

    if(skill.targets.length === 0 || !skill.targetEffects) {
      throw new Error(`Skill ${JSON.stringify(skill)} is trying to Delay but has no targets.`);
    }

    Object.keys(skill.targetEffects).forEach(characterId => {
      skill.targetEffects[characterId].forEach(effect => {

        let totalAccuracy = <number>accuracy;
        if(AttackAccuracyFunctions[accuracy]) {
          totalAccuracy = AttackAccuracyFunctions[accuracy](caster, combat.characters[characterId], combat);
        }

        effect.accuracy = totalAccuracy;

      });
    });

    return skill;
  };
