
import { Entity, ObjectIdColumn, Column } from 'typeorm';

import { IFestival } from '../../interfaces';

@Entity()
export class Festivals {

  @ObjectIdColumn() public _id: string;

  @Column() public festivals: IFestival[];

  public init() {
    if(!this.festivals) this.festivals = [];
  }

  public addFestival(festival: IFestival) {
    this.festivals.push(festival);
  }

  public removeFestival(festivalId: string) {
    this.festivals = this.festivals.filter(x => x.id !== festivalId);
  }
}
