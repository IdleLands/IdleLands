
import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { IGlobalQuest } from '../../interfaces';

@Entity()
export class GlobalQuests {

  @ObjectIdColumn() public _id: string;

  @Column() public globalQuests: IGlobalQuest[];

  public init() {
    if(!this.globalQuests) this.globalQuests = [];
  }

  public addGlobalQuest(gQuest: IGlobalQuest) {
    this.globalQuests.unshift(gQuest);
  }

  public removeGlobalQuest(globalQuestId: string) {
    this.globalQuests = this.globalQuests.filter(x => x.id !== globalQuestId);
  }
}
