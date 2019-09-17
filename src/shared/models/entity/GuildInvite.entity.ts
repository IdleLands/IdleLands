
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { IGuildApplication } from '../../interfaces';

@Entity()
export class GuildInvite implements IGuildApplication {

  @ObjectIdColumn() public _id: string;

  @Column() public type: 'invite' | 'application';
  @Column() public playerName: string;
  @Column() public guildName: string;
}
