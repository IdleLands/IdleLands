import { PartialCombatSkill, ICombatCharacter, ICombat, ICombatSkillCombinator } from '../interfaces';

export class CombatSimulator {

  formSkillResult(
    caster: ICombatCharacter,
    combat: ICombat,
    ...combinators: ICombatSkillCombinator[]
  ): PartialCombatSkill {

    const baseSkill: PartialCombatSkill = {};

    return combinators.reduce((prev, cur) => {
      return cur(prev, caster, combat);
    }, baseSkill);

  }

  formAllSkillResults(caster: ICombatCharacter, combat: ICombat, allCombinators: Array<ICombatSkillCombinator[]>): PartialCombatSkill[] {
    return allCombinators.map(x => this.formSkillResult(caster, combat, ...x));
  }

}
