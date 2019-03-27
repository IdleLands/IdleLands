
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
    return player.$statistics.get('Game.Premium.ChoiceLogSize');
  }

  public init(player: Player): void {
    this.size = this.calcSize(player);

    this.choices = this.choices.map(choice => {
      const choiceRef = new Choice();
      choiceRef.init(choice);
      return choiceRef;
    });
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
      player.$statistics.increase(`Character.Choose.Ignore`);
      this.makeDecision(player, choice, choice.choices.indexOf(poppedChoice.defaultChoice));
    }
  }

  public makeDecision(player: Player, choice: Choice, decisionSlot: number, doRemove = true) {
    player.$statistics.increase(`Character.Choose.${choice.choices[decisionSlot]}`);
    if(doRemove) this.removeChoice(choice);
  }

}
