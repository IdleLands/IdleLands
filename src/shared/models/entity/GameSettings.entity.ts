
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class GameSettings {

  @ObjectIdColumn() public _id: string;

  @Column() public motd: string;

  public init() {
  }
}
