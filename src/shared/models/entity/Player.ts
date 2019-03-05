
import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';

@Entity()
export class Player {

  @ObjectIdColumn()
  public id: number;

  @Column()
  @Index({ unique: true })
  public userId: string;

  @Column()
  @Index({ unique: true })
  public authId: string;

  @Column()
  @Index({ unique: true })
  public name: string;
}
