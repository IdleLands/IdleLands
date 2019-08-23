import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { IGlobalQuest, ServerEventName, GachaNameReward } from '../../../shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-quests-global',
  templateUrl: './quests-global.page.html',
  styleUrls: ['./quests-global.page.scss'],
})
export class QuestsGlobalPage implements OnInit {

  public isLoading: boolean;
  public quests: IGlobalQuest[] = [];

  public get playerName(): string {
    return this.gameService.playerRef.name;
  }

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.http.get(`${this.gameService.apiUrl}/globalquests`)
      .pipe(map((x: any) => x.globalQuests))
      .subscribe(qQuests => {
        this.isLoading = false;
        this.quests = qQuests.filter(x => this.isQuestValid(x));
      });
  }

  canCollect(quest: IGlobalQuest): boolean {
    return (quest.claimedBy ? !quest.claimedBy[this.playerName] : true)
        && quest.objectives.every(obj => obj.progress >= obj.statisticValue)
        && quest.objectives.some(obj => !!(obj.contributions && obj.contributions[this.playerName]));
  }

  collect(quest: IGlobalQuest) {
    this.socketService.emit(ServerEventName.GlobalQuestCollect, { questId: quest.id });
  }

  public isQuestValid(quest: IGlobalQuest): boolean {
    return quest.endsAt > Date.now();
  }

  async showRewards(quest: IGlobalQuest) {

    const generateTable = (rewards: string[]) => {
      const rewardStr = rewards.map(rew => `<tr><td>${GachaNameReward[rew]}</td></tr>`).join('');
      return `<table>${rewardStr}</table>`;
    };

    const finalString = `
      <h3>First Place (x7)</h3>
      ${generateTable(quest.rewards.first)}
      <br>
      <h3>Second Place (x5)</h3>
      ${generateTable(quest.rewards.second)}
      <br>
      <h3>Third Place (x3)</h3>
      ${generateTable(quest.rewards.third)}
      <br>
      <h3>Runner-ups (x1)</h3>
      ${generateTable(quest.rewards.other)}
      <br>
    `;

    const alert = await this.alertCtrl.create({
      header: `Rewards (${quest.name})`,
      message: finalString,
      buttons: [
        'OK'
      ]
    });

    alert.present();
  }

}
