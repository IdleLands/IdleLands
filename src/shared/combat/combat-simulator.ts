
import * as Chance from 'chance';
import { sortBy, size } from 'lodash';
import { Subject } from 'rxjs';

import { ProfessionSkillMap, AttributeSkillMap, AffinitySkillMap } from './skillgroups';

import { PartialCombatSkill, ICombatCharacter, ICombat, ICombatSkillCombinator, Stat, ICombatSkillEffect } from '../interfaces';

export enum CombatAction {
  PrintStatistics,
  Victory
}

export class CombatSimulator {

  private chance: Chance;
  private events: Subject<{ action: CombatAction, data: any }> = new Subject<{ action: CombatAction, data: any }>();
  public get events$() {
    return this.events;
  }

  constructor(private combat: ICombat) {
    if(!combat.seed) combat.seed = Date.now();

    this.chance = new Chance(combat.seed);
    combat.chance = this.chance;
  }

  private formSkillResult(
    caster: ICombatCharacter,
    combinators: ICombatSkillCombinator[]
  ): PartialCombatSkill {

    const baseSkill: PartialCombatSkill = {};

    return combinators.reduce((prev, cur) => {
      return cur(prev, caster, this.combat);
    }, baseSkill);

  }

  private formAllSkillResults(caster: ICombatCharacter, allCombinators: Array<ICombatSkillCombinator[]>): PartialCombatSkill[] {
    return allCombinators.map(x => this.formSkillResult(caster, x));
  }

  private emitAction(action: { action: CombatAction, data: any }) {
    this.events.next(action);
  }

  private getSkillsForCharacter(character: ICombatCharacter) {
    const arr = [];

    if(ProfessionSkillMap[character.profession])                        arr.push(...ProfessionSkillMap[character.profession]);
    if(AffinitySkillMap[character.affinity])                            arr.push(...AffinitySkillMap[character.affinity]);
    if(AttributeSkillMap[character.attribute] && character.rating >= 5) arr.push(...AttributeSkillMap[character.attribute]);

    return arr;
  }

  // currently, if any stat <= 0, the character is dead
  private isDead(character: ICombatCharacter): boolean {
    return Object.keys(character.stats).filter(stat => stat !== Stat.SPECIAL).some(stat => character.stats[stat] <= 0);
  }

  private addCombatEffect(character: ICombatCharacter, effect: ICombatSkillEffect): void {
    const delay = effect.turnsUntilEffect || 0;

    character.effects = character.effects || [];
    character.effects[delay] = character.effects[delay] || [];
    character.effects[delay].push(effect);
  }

  private doSkill(caster: ICombatCharacter, skill: Array<ICombatSkillCombinator[]>) {
    const effects = this.formAllSkillResults(caster, skill);
    effects.forEach(effect => {
      effect.targets.forEach(target => {
        effect.targetEffects[target].forEach(targetEffect => {
          this.addCombatEffect(this.combat.characters[target], targetEffect);
        });
      });
    });
  }

  private applyNextEffects(character: ICombatCharacter) {
    if(!character.effects) return;

    const effects = character.effects.shift();
    if(!effects || !effects.length) return;

    console.log(effects);
  }

  beginCombat() {

    // display stuff
    this.emitAction({ action: CombatAction.PrintStatistics, data: this.combat });
    this.beginRound();
  }

  beginRound() {
    // order combatants by agi
    const combatantOrder = sortBy(Object.values(this.combat.characters), (char) => char.stats[Stat.AGI]);
    combatantOrder.forEach(comb => {
      const skills = this.getSkillsForCharacter(comb);

      const chosenSkill: Array<ICombatSkillCombinator[]> = this.chance.weighted(
        skills.map(x => x.skills),
        skills.map(x => x.weight)
      );

      this.doSkill(comb, chosenSkill);
    });

    combatantOrder.forEach(comb => {
      this.applyNextEffects(comb);
    });

    // this.endRound();
  }

  endRound() {
    // print round statistics
    this.emitAction({ action: CombatAction.PrintStatistics, data: this.combat });

    // check what teams are still alive
    const livingParties = {};
    Object.values(this.combat.characters).forEach(char => {
      if(this.isDead(char)) return;
      livingParties[char.combatPartyId] = true;
    });

    // check if everyone is dead
    if(size(livingParties) === 0) return this.endCombat({ wasTie: true });

    // check if only one team is alive
    if(size(livingParties) === 1) return this.endCombat();

    this.beginRound();
  }

  endCombat(args?: { wasTie: boolean }) {
    console.log({ args });
    // decide winner/loser
  }

}
