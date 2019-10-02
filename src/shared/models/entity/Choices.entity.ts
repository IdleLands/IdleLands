
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { find, sample, isArray } from 'lodash';

import { PlayerOwned } from './PlayerOwned';
import { IChoice } from '../../interfaces';
import { Player } from './Player.entity';
import { Choice } from '../Choice';

@Entity()
export class Choices extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private choices: { [key: string]: IChoice };

  @Column()
  private size: number;

  public get $choicesData() {
    return { choices: this.choices, size: this.size };
  }

  constructor() {
    super();
    if(!this.choices) this.choices = { };
  }

  // basic functions
  private calcSize(player: Player): number {
    return player.$statistics.get('Game/Premium/Upgrade/ChoiceLogSize');
  }

  public removeChoicesOfId(id: string) {
    Object.keys(this.choices).forEach(key => {
      if(id !== key) return;
      delete this.choices[key];
    });
  }

  public init(player: Player): void {
    if(isArray(this.choices)) {
      const newChoices = { };
      this.choices.forEach(choice => {
        newChoices[choice.foundAt] = choice;
      });

      this.choices = newChoices;
    }

    this.updateSize(player);

    Object.keys(this.choices).forEach(choiceKey => {
      const choice = this.choices[choiceKey];

      const choiceRef = new Choice();
      choiceRef.init(choice);
      return choiceRef;
    });

    this.removeChoicesOfId('PartyLeave');
  }

  public updateSize(player: Player) {
    this.size = this.calcSize(player);
  }

  public removeAllChoices() {
    this.choices = { };
  }

  public removeChoice(choice: Choice): void {
    delete this.choices[choice.foundAt];
  }

  public getChoice(choiceId: string): Choice {
    return find(this.choices, { id: choiceId });
  }

  public addChoice(player: Player, choice: Choice) {

    if(player.$personalities.isActive('Affirmer') && choice.choices.indexOf('Yes') > -1) {
      const shouldRemove = player.$$game.eventManager.doChoiceFor(player, choice, 'Yes');
      this.makeDecision(player, choice, choice.choices.indexOf(choice.defaultChoice), shouldRemove);
      return;
    }

    if(player.$personalities.isActive('Denier') && choice.choices.indexOf('No') > -1) {
      const shouldRemove = player.$$game.eventManager.doChoiceFor(player, choice, 'No');
      this.makeDecision(player, choice, choice.choices.indexOf(choice.defaultChoice), shouldRemove);
      return;
    }

    if(player.$personalities.isActive('Indecisive')) {
      const decision = choice.defaultChoice;
      const shouldRemove = player.$$game.eventManager.doChoiceFor(player, choice, decision);
      this.makeDecision(player, choice, choice.choices.indexOf(choice.defaultChoice), shouldRemove);
      return;
    }

    this.choices[choice.foundAt] = choice;

    const allChoiceKeys = Object.keys(this.choices);

    if(allChoiceKeys.length > this.size) {
      const poppedChoice = this.choices[allChoiceKeys[0]];
      player.increaseStatistic(`Character/Choose/Ignore`, 1);
      this.removeChoice(poppedChoice);
    }
  }

  public makeDecision(player: Player, choice: Choice, decisionSlot: number, doRemove = true) {
    player.increaseStatistic(`Character/Choose/Choice/${choice.choices[decisionSlot]}`, 1);
    player.increaseStatistic(`Character/Choose/Total`, 1);

    if(player.$personalities.isActive('Affirmer')) {
      player.increaseStatistic(`Character/Choose/Personality/Affirmer`, 1);
    }

    if(player.$personalities.isActive('Denier')) {
      player.increaseStatistic(`Character/Choose/Personality/Denier`, 1);
    }

    if(player.$personalities.isActive('Indecisive')) {
      player.increaseStatistic(`Character/Choose/Personality/Indecisive`, 1);
    }

    if(doRemove) this.removeChoice(choice);
  }

}
