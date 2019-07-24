
import * as Chance from 'chance';

import { PartialCombatSkill, ICombatCharacter, ICombat, ICombatSkillCombinator } from '../interfaces';

export class CombatSimulator {

  private chance: Chance;

  constructor(private combat: ICombat) {
    if(!combat.seed) combat.seed = Date.now();

    this.chance = new Chance(combat.seed);
    combat.chance = this.chance;
  }

  formSkillResult(
    caster: ICombatCharacter,
    combinators: ICombatSkillCombinator[]
  ): PartialCombatSkill {

    const baseSkill: PartialCombatSkill = {};

    return combinators.reduce((prev, cur) => {
      return cur(prev, caster, this.combat);
    }, baseSkill);

  }

  formAllSkillResults(caster: ICombatCharacter, allCombinators: Array<ICombatSkillCombinator[]>): PartialCombatSkill[] {
    return allCombinators.map(x => this.formSkillResult(caster, x));
  }

  beginCombat() {
    // print statistics
    // beginRound
  }

  beginRound() {
    // order combatants by agi
    // each combatant takes a turn
    //  picks a random skill
    //  does random skill
    // endRound
  }

  endRound() {
    // print round statistics
    // check if only one team is alive
    // if so, endCombat
  }

  endCombat() {
    // decide winner/loser
  }

}
