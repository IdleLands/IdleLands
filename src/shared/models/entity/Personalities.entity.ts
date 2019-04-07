
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { PlayerOwned } from './PlayerOwned';
import { Personality } from '../../interfaces';

@Entity()
export class Personalities extends PlayerOwned {

  // internal vars
  @ObjectIdColumn() public _id: string;

  @Column()
  private personalities: { [key: string]: string };

  @Column()
  private activePersonalities: { [key: string]: boolean };

  public get $personalitiesData() {
    return { personalities: this.personalities, activePersonalities: this.activePersonalities };
  }

  constructor() {
    super();
    if(!this.personalities) this.personalities = {};
    if(!this.activePersonalities) this.activePersonalities = {};
  }

  public has(personality: string): boolean {
    return !!this.personalities[personality];
  }

  public isActive(personality: string): boolean {
    return this.personalities[personality] && this.activePersonalities[personality];
  }

  public toggle(personality: Personality): void {
    const name = (<any>personality).name;
    if(!this.personalities[name]) return;

    this.activePersonalities[name] = !this.activePersonalities[name];
    
    const toggleOff = (<any>personality).toggleOff;
    if(this.activePersonalities[name] && toggleOff) {
      toggleOff.forEach(pers => this.activePersonalities[pers] = false);
    }
  }

  public add(personality: Personality): void {
    this.personalities[(<any>personality).name] = (<any>personality).description;
  }

  public resetPersonalitiesTo(personalities: Personality[]): void {
    this.personalities = {};

    personalities.forEach(pers => this.add(pers));
  }

}
