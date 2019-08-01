
import * as Chance from 'chance';
import { sortBy, size, cloneDeep } from 'lodash';
import { Subject } from 'rxjs';

import { ProfessionSkillMap, AttributeSkillMap, AffinitySkillMap,
         Attack, ProfessionPreRoundSkillMap, ProfessionPostRoundSkillMap } from './skillgroups';

import { PartialCombatSkill, ICombatCharacter, ICombat, ICombatSkillCombinator, Stat, ICombatSkillEffect } from '../interfaces';

export enum CombatAction {

  // inbetween round print statistics
  PrintStatistics,

  // normal message string
  Message,

  // summary message string
  SummaryMessage,

  // all the data that signifies the end of combat
  Victory,

  // increment a particular statistic for a player
  IncrementStatistic
}

export class CombatSimulator {
  public get events$() {
    return this.events;
  }

  constructor(private combat: ICombat) {
    this.combat = cloneDeep(this.combat);

    if(!this.combat.seed) this.combat.seed = Date.now();
    if(!this.combat.currentRound) this.combat.currentRound = 0;
    if(!this.combat.timestamp) this.combat.timestamp = Date.now();

    this.chance = new Chance(this.combat.seed);
    this.combat.chance = this.chance;
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
    const res = cloneDeep(combat);

    delete res.chance;
    return res;
  }

  private getPreRoundSkillsForCharacter(character: ICombatCharacter) {
    return (ProfessionPreRoundSkillMap[character.profession] || [])
            .filter(x => x.canUse ? x.canUse(character, this.combat) : true);
  }

  private getPostRoundSkillsForCharacter(character: ICombatCharacter) {
    return (ProfessionPostRoundSkillMap[character.profession] || [])
            .filter(x => x.canUse ? x.canUse(character, this.combat) : true);
  }

  private getSkillsForCharacter(character: ICombatCharacter) {
    const arr = [];

    if(ProfessionSkillMap[character.profession])                        arr.push(...ProfessionSkillMap[character.profession]);
    if(AffinitySkillMap[character.affinity])                            arr.push(...AffinitySkillMap[character.affinity]);
    if(AttributeSkillMap[character.attribute] && character.rating >= 5) arr.push(...AttributeSkillMap[character.attribute]);

    if(arr.length === 0) {
      arr.push({ weight: 1, skills: [Attack] });
    }

    return arr
           .filter(x => x.canUse ? x.canUse(character, this.combat) : true);
  }

  // currently, if hp <= 0, the character is dead
  private isDead(character: ICombatCharacter): boolean {
    return character.stats[Stat.HP] <= 0;
  }

  private addCombatEffect(character: ICombatCharacter, effect: ICombatSkillEffect): void {
    const delay = effect.turnsUntilEffect || 0;
    const duration = effect.turnsEffectLasts || 0;

    character.effects = character.effects || [];

    let turn = delay;
    do {
      character.effects[turn] = character.effects[turn] || [];
      character.effects[turn].push(effect);

      turn++;
    } while(turn < delay + duration);
  }

  private doSkill(caster: ICombatCharacter, skill: Array<ICombatSkillCombinator[]>) {
    const effects = this.formAllSkillResults(caster, skill);
    effects.forEach(effect => {
      effect.targets.forEach(target => {
        effect.targetEffects[target].forEach(targetEffect => {

          // if an effect happens to suggest it is immediate, we can do this.
          // this would typically be a message that would look weird showing up later
          if(targetEffect.immediate) {
            this.applySingleEffect(this.combat.characters[target], targetEffect);
            return;
          }

          this.addCombatEffect(this.combat.characters[target], targetEffect);
        });
      });
    });
  }

  private doSkillImmediately(caster: ICombatCharacter, skill: Array<ICombatSkillCombinator[]>) {
    const effects = this.formAllSkillResults(caster, skill);
    effects.forEach(effect => {
      effect.targets.forEach(target => {
        effect.targetEffects[target].forEach(targetEffect => {
          this.applySingleEffect(this.combat.characters[target], targetEffect);
        });
      });
    });
  }

  private formatMessage(skillEffect: ICombatSkillEffect, forCharacter: ICombatCharacter): string {
    if(!skillEffect.desc) return '';

    const replacements: Array<{ replace: string, with: string }> = [
      { replace: 'source',  with: this.combat.characters[skillEffect.source].name },
      { replace: 'value',   with: Math.abs(skillEffect.modifyStatValue).toLocaleString() },
      { replace: 'rvalue',  with: skillEffect.modifyStatValue.toLocaleString() },
      { replace: 'target',  with: forCharacter.name },
      { replace: 'special', with: forCharacter.specialName || 'special' }
    ];

    return replacements.reduce((prev, cur) => {
      return prev.split(`%${cur.replace}`).join(cur.with);
    }, skillEffect.desc);
  }

  private applySingleEffect(character: ICombatCharacter, effect: ICombatSkillEffect) {

    if(effect.modifyStat) {
      // roll accuracy, if it fails, set the value to 0
      if(!this.chance.bool({ likelihood: Math.max(0, Math.min(100, effect.accuracy)) })) {
        effect.modifyStatValue = 0;
      }

      // round modifyStatValue always
      effect.modifyStatValue = Math.floor(effect.modifyStatValue);

      // special cap handling for HP and Special
      if(effect.modifyStat === Stat.HP) {
        if(effect.modifyStatValue + character.stats[Stat.HP] > character.maxStats[Stat.HP]) {
          effect.modifyStatValue = character.maxStats[Stat.HP] - character.stats[Stat.HP];
        }
      }

      if(effect.modifyStat === Stat.SPECIAL) {
        if(effect.modifyStatValue + character.stats[Stat.SPECIAL] > character.maxStats[Stat.SPECIAL]) {
          effect.modifyStatValue = character.maxStats[Stat.SPECIAL] - character.stats[Stat.SPECIAL];
        }
      }

      // apply the value to the stat
      character.stats[effect.modifyStat] += effect.modifyStatValue;
    }

    // share what happened with the world
    const message = this.formatMessage(effect, character);
    this.events$.next({ action: CombatAction.Message, data: { message, combat: this.formatCombat(this.combat) } });

    // do statistic modifications
    if(effect.modifyStat === Stat.HP) {
      const giver = this.combat.characters[effect.source];

      const type = effect.modifyStatValue === 0 ? 'Miss' : (effect.modifyStatValue < 0 ? 'Damage' : 'Healing');
      const incrementValue = effect.modifyStatValue === 0 ? 1 : Math.abs(effect.modifyStatValue);

      this.incrementStatistic(giver, `Combat/All/Give/Attack/Times`, 1);
      this.incrementStatistic(giver, `Combat/All/Give/${type}`, incrementValue);
      this.incrementStatistic(giver, `Combat/All/Receive/Attack/Times`, 1);
      this.incrementStatistic(character, `Combat/All/Receive/${type}`, incrementValue);

      if(character.stats[Stat.HP] <= 0) {
        character.stats[Stat.HP] = 0;
        character.effects = [];
        this.incrementStatistic(giver, `Combat/All/Kill/${character.realName ? 'Player' : 'Monster'}`);
      }
    }

  }

  private applyNextEffects(character: ICombatCharacter) {
    if(!character.effects) return;

    const effects = character.effects.shift();
    if(!effects || !effects.length) return;

    effects.forEach(effect => {
      this.applySingleEffect(character, effect);
    });
  }

  private cleanUpDeadSummons() {
    Object.keys(this.combat.characters).forEach(combatId => {
      const check = this.combat.characters[combatId];

      if(!check.ownerId) return;
      if(check.stats[Stat.HP] > 0) return;

      delete this.combat.characters[combatId];
    });
  }

  beginCombat() {

    // display stuff
    this.emitAction({
      action: CombatAction.PrintStatistics,
      data: this.formatCombat(this.combat)
    });

    this.beginRound();
  }

  beginRound() {
    // increment round for tracking purposes
    this.combat.currentRound++;

    // get valid combatants
    const validCombatants = Object.values(this.combat.characters);

    // order combatants by agi
    const combatantOrder = sortBy(validCombatants, (char) => char.stats[Stat.AGI]);

    // only living people get to do skills
    combatantOrder.filter(x => x.stats[Stat.HP] > 0).forEach(comb => {

      // get pre-round skills if any and cast them
      const preroundSkills = this.getPreRoundSkillsForCharacter(comb);
      if(preroundSkills.length > 0) {
        preroundSkills.forEach(({ skills }) => {
          this.doSkillImmediately(comb, skills);
        });
      }

      // get skill from other skills and use it
      const validSkills = this.getSkillsForCharacter(comb);

      const chosenSkill: Array<ICombatSkillCombinator[]> = this.chance.weighted(
        validSkills.map(x => x.skills),
        validSkills.map(x => x.weight)
      );

      this.doSkill(comb, chosenSkill);
    });

    // buuuuttt... dead people may have effects cast on them that we have to consider
    combatantOrder.forEach(comb => {
      this.applyNextEffects(comb);
    });

    this.cleanUpDeadSummons();

    // do post-round skills too
    combatantOrder.filter(x => x.stats[Stat.HP] > 0).forEach(comb => {

      // get pre-round skills if any and cast them
      const postroundSkills = this.getPostRoundSkillsForCharacter(comb);
      if(postroundSkills.length > 0) {
        postroundSkills.forEach(({ skills }) => {
          this.doSkillImmediately(comb, skills);
        });
      }
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

    // arbitrary round timer just in case
    if(this.combat.currentRound >= 300) return this.endCombat({ wasTie: true });

    this.beginRound();
  }

  endCombat(args: { wasTie?: boolean, winningParty?: number } = {}) {
    if(args.wasTie) {
      this.addSummaryMessage(`It was a draw! No winners! No rewards!`);

      this.events$.next({
        action: CombatAction.Victory,
        data: { wasTie: true, combat: this.formatCombat(this.combat) }
      });

      return;
    }

    const winningPlayers = Object
      .values(this.combat.characters)
      .filter(char => char.combatPartyId === args.winningParty);

    const winningParty = this.combat.parties[args.winningParty];

    this.addSummaryMessage(`${winningParty.name} (${winningPlayers.map(char => char.name).join(', ')}) have won the battle!`);

    this.events$.next({
      action: CombatAction.Victory,
      data: { wasTie: args.wasTie, combat: this.formatCombat(this.combat), winningParty: args.winningParty }
    });

    Object.values(this.combat.characters).forEach(char => {
      const didWin = char.combatPartyId === args.winningParty;
      const combatType = args.wasTie ? 'Tie' : (didWin ? 'Win' : 'Lose');

      this.incrementStatistic(char, `Combat/All/Times/Total`);
      this.incrementStatistic(char, `Combat/All/Times/${combatType}`);
    });
  }

  addSummaryMessage(message: string) {
    this.events$.next({
      action: CombatAction.SummaryMessage,
      data: message
    });
  }

  incrementStatistic(char: ICombatCharacter, statistic: string, value = 1) {
    if(!char.realName) return;

    this.events$.next({
      action: CombatAction.IncrementStatistic,
      data: { statistic, value, name: char.realName }
    });

    this.events$.next({
      action: CombatAction.IncrementStatistic,
      data: { statistic: statistic.split('All').join(`Profession/${char.profession}`), value, name: char.realName }
    });
  }
}
