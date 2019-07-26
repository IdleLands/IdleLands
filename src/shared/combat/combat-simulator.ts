
import * as Chance from 'chance';
import { sortBy, size, find } from 'lodash';
import { Subject } from 'rxjs';

import { ProfessionSkillMap, AttributeSkillMap, AffinitySkillMap } from './skillgroups';

import { PartialCombatSkill, ICombatCharacter, ICombat, ICombatSkillCombinator, Stat, ICombatSkillEffect } from '../interfaces';

export enum CombatAction {

  // inbetween round print statistics
  PrintStatistics,

  // normal message string
  Message,

  // summary message string
  SummaryMessage,

  // all the data that signifies the end of combat
  Victory
}

export class CombatSimulator {
  public get events$() {
    return this.events;
  }

  constructor(private combat: ICombat) {
    if(!combat.seed) combat.seed = Date.now();

    this.chance = new Chance(combat.seed);
    combat.chance = this.chance;
  }

  private chance: Chance;
  private events: Subject<{ action: CombatAction, data: any }> = new Subject<{ action: CombatAction, data: any }>();

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

  private formatCombat(combat: ICombat): any {
    const res = {
      ...combat
    };

    delete res.chance;
    return res;
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
    return character.stats[Stat.HP] <= 0;
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

  private formatMessage(skillEffect: ICombatSkillEffect, forCharacter: ICombatCharacter): string {
    if(!skillEffect.desc) return '';

    const replacements: Array<{ replace: string, with: string }> = [
      { replace: 'source', with: this.combat.characters[skillEffect.source].name },
      { replace: 'value',  with: Math.abs(skillEffect.modifyStatValue).toLocaleString() },
      { replace: 'target', with: forCharacter.name }
    ];

    return replacements.reduce((prev, cur) => {
      return prev.split(`%${cur.replace}`).join(cur.with);
    }, skillEffect.desc);
  }

  private applyNextEffects(character: ICombatCharacter) {
    if(!character.effects) return;

    const effects = character.effects.shift();
    if(!effects || !effects.length) return;

    effects.forEach(effect => {

      // roll accuracy, if it fails, set the value to 0
      if(!this.chance.bool({ likelihood: Math.max(0, Math.min(100, effect.accuracy)) })) {
        effect.modifyStatValue = 0;
      }

      character.stats[effect.modifyStat] += effect.modifyStatValue;

      const message = this.formatMessage(effect, character);
      this.events$.next({ action: CombatAction.Message, data: message });
    });
  }

  beginCombat() {

    // display stuff
    this.emitAction({
      action: CombatAction.PrintStatistics,
      data: this.combat
    });

    this.beginRound();
  }

  beginRound() {
    // increment round for tracking purposes
    this.combat.currentRound++;

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

    this.endRound();
  }

  endRound() {
    // print round statistics
    this.emitAction({
      action: CombatAction.PrintStatistics,
      data: this.formatCombat(this.combat)
    });

    // check what teams are still alive
    const livingParties = {};
    Object.values(this.combat.characters).forEach(char => {
      if(this.isDead(char)) return;
      livingParties[char.combatPartyId] = true;
    });

    // check if everyone is dead
    if(size(livingParties) === 0) return this.endCombat({ wasTie: true });

    // check if only one team is alive
    if(size(livingParties) === 1) return this.endCombat({ winningParty: +Object.keys(livingParties)[0] });

    this.beginRound();
  }

  endCombat(args: { wasTie?: boolean, winningParty?: number } = {}) {
    const winningPlayers = Object
      .values(this.combat.characters)
      .filter(char => char.combatPartyId === args.winningParty)
      .map(char => char.name);

    const winningParty = find(this.combat.parties, { id: args.winningParty });

    this.events$.next({
      action: CombatAction.SummaryMessage,
      data: `${winningPlayers.join(', ')} (${winningParty.name}) have won the battle!`
    });

    this.events$.next({
      action: CombatAction.Victory,
      data: { wasTie: args.wasTie, combat: this.formatCombat(this.combat), winningParty: args.winningParty }
    });
  }

}
