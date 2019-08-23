import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { IQuest, ServerEventName } from '../../../shared/interfaces';

@Component({
  selector: 'app-quests-personal',
  templateUrl: './quests-personal.page.html',
  styleUrls: ['./quests-personal.page.scss'],
})
export class QuestsPersonalPage implements OnInit, OnDestroy {

  private rewardsCb: Function;

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.rewardsCb = ({ rewards }) => this.gameService.showRewards('Quest Rewards', rewards);
    this.socketService.register(ServerEventName.QuestRewards, this.rewardsCb);
  }

  ngOnDestroy() {
    this.socketService.unregister(ServerEventName.QuestRewards, this.rewardsCb);
  }

  canCollect(quest: IQuest): boolean {
    return quest.objectives.every(obj => obj.progress >= obj.statisticValue);
  }

  reroll(quest: IQuest) {
    this.socketService.emit(ServerEventName.QuestReroll, { questId: quest.id });
  }

  collect(quest: IQuest) {
    this.socketService.emit(ServerEventName.QuestCollect, { questId: quest.id });
  }

}
