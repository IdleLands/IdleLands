
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { find, pull, last } from 'lodash';

import { PlayerOwned } from './PlayerOwned';
import { IChoice } from '../../interfaces';
import { Player } from './Player.entity';
import { Choice } from '../Choice';

@Entity()
export class Choices extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private choices: IChoice[];

  @Column()
  private size: number;

  public get $choicesData() {
    return { choices: this.choices, size: this.size };
  }

  constructor() {
    super();
    if(!this.choices) this.choices = [];
  }

  // basic functions
  private calcSize(player: Player): number {
    return player.$statistics.get('Game/Premium/ChoiceLogSize');
  }

  public init(player: Player): void {
    this.size = this.calcSize(player);

    this.choices = this.choices.map(choice => {
      const choiceRef = new Choice();
      choiceRef.init(choice);
      return choiceRef;
    });

    this.choices = this.choices.filter(x => x.id !== 'PartyLeave');
  }

  public removeChoice(choice: Choice): void {
    pull(this.choices, choice);
  }

  public getChoice(choiceId: string): Choice {
    return find(this.choices, { id: choiceId });
  }

  public addChoice(player: Player, choice: Choice) {
    this.choices.unshift(choice);

    if(this.choices.length > this.size) {
      const poppedChoice = last(this.choices);
      player.increaseStatistic(`Character/Choose/Ignore`, 1);
      this.makeDecision(player, choice, choice.choices.indexOf(poppedChoice.defaultChoice));
    }
  }

  public makeDecision(player: Player, choice: Choice, decisionSlot: number, doRemove = true) {
    player.increaseStatistic(`Character/Choose/Choice/${choice.choices[decisionSlot]}`, 1);
    player.increaseStatistic(`Character/Choose/Total`, 1);

    if(player.hasPersonality('Affirmer')) {
      player.increaseStatistic(`Character/Choose/Personality/Affirmer`, 1);
    }

    if(player.hasPersonality('Denier')) {
      player.increaseStatistic(`Character/Choose/Personality/Denier`, 1);
    }

    if(player.hasPersonality('Indecisive')) {
      player.increaseStatistic(`Character/Choose/Personality/Indecisive`, 1);
    }

    if(doRemove) this.removeChoice(choice);
  }

}
