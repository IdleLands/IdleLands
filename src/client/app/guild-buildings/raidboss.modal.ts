import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName, GuildBuildingLevelValues, GuildBuilding, GachaReward, GachaNameReward } from '../../../shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar color="primary">
        <ion-title>Raid Bosses</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-list>
        <ion-item *ngFor="let boss of bosses">
          <ion-label>
            <h3>Level {{ boss.level }} {{ boss.profession }}</h3>
            <p>Costs {{ boss.cost | number }} gold</p>
            <p>Special Scale Stat: {{ boss.scaleStat | uppercase }}</p>
            <p>Rewards: <span *ngFor="let reward of boss.rewards">{{ rewardName(reward) }}</span>
          </ion-label>

          <ion-button slot="end"
                      *ngIf="gameService.isGuildMod"
                      [disabled]="gameService.guild.resources.gold < boss.cost" (click)="runRaid(boss.level)">Fight</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class RaidBossModal implements OnInit {

  public bosses: any[] = [];

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    public socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    const bossLevel = GuildBuildingLevelValues[GuildBuilding.RaidPortal](this.gameService.guild.buildingLevels[GuildBuilding.RaidPortal]);

    this.http.get(`${this.gameService.apiUrl}/guilds/raids`, { params: { maxLevel: '' + bossLevel } })
    .pipe(map((x: any) => x.raids))
    .subscribe(raids => {
      this.bosses = raids;
    });
  }

  public runRaid(bossLevel: number) {
    this.socketService.emit(ServerEventName.GuildRaidBoss,  { bossLevel });
    this.dismiss();
  }

  public rewardName(reward: GachaReward): string {
    return GachaNameReward[reward];
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
