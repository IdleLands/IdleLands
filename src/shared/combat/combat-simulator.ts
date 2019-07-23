import { PartialSkill, ICombatCharacter, ICombat, ISkillCombinator } from '../interfaces';

export class CombatSimulator {

  formSkillResult(
    caster: ICombatCharacter,
    combat: ICombat,
    ...combinators: ISkillCombinator[]
  ): PartialSkill {

    const baseSkill: PartialSkill = {};

    return combinators.reduce((prev, cur) => {
      return cur(prev, caster, combat);
    }, baseSkill);

  }

  formAllSkillResults(caster: ICombatCharacter, combat: ICombat, allCombinators: Array<ISkillCombinator[]>): PartialSkill[] {
    return allCombinators.map(x => this.formSkillResult(caster, combat, ...x));
  }

}
