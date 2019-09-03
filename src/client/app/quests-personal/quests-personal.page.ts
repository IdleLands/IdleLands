import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { IQuest, ServerEventName } from '../../../shared/interfaces';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-quests-personal',
  templateUrl: './quests-personal.page.html',
  styleUrls: ['./quests-personal.page.scss'],
})
export class QuestsPersonalPage implements OnInit, OnDestroy {

  private rewardsCb: Function;

  constructor(
    private alertCtrl: AlertController,
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

  async reroll(quest: IQuest) {
    const finish = () => {
      this.socketService.emit(ServerEventName.QuestReroll, { questId: quest.id });
    };

    if(!quest.objectives.some(x => !!x.progress)) {
      finish();
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Reroll Quest?',
      message: 'Are you sure you want to reroll this quest? It has some progress.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, reroll it!', handler: () => {
          finish();
        } }
      ]
    });

    alert.present();
  }

  collect(quest: IQuest) {
    this.socketService.emit(ServerEventName.QuestCollect, { questId: quest.id });
  }

}
