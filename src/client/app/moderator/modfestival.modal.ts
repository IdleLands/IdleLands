import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName, IFestival } from '../../../shared/interfaces';

@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar color="primary">
        <ion-title>Create Festival</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="create()" [disabled]="!isValidFestival">Create</ion-button>
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-list>
        <ion-item-group>
          <ion-list-header>Metadata</ion-list-header>
          <ion-item>
            <ion-label position="stacked">
              <strong class="stat-fixed-width">Festival Name</strong>
            </ion-label>

            <ion-input type="text" placeholder="Enter name here..."
                       [(ngModel)]="festival.name"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              <strong class="stat-fixed-width">Festival Duration (Hours)</strong>
            </ion-label>

            <ion-input type="number" placeholder="Enter hours here..."
                       [(ngModel)]="durationHours"></ion-input>
          </ion-item>
        </ion-item-group>

        <ion-item-group>
          <ion-list-header>Stat Boosts</ion-list-header>
          <ion-item *ngFor="let stat of ['str', 'int', 'dex', 'agi', 'con', 'luk', 'hp', 'xp', 'gold']">
            <ion-icon slot="start" [src]="'assets/icon/stat-' + stat + '.svg'"></ion-icon>

            <ion-label position="stacked" >
              <strong class="stat-fixed-width">{{ stat.toUpperCase() }}</strong>
            </ion-label>

            <ion-input type="number" [placeholder]="stat.toUpperCase() + ' (1 = 1%, not 100%)'"
                       [(ngModel)]="festival.stats[stat]"></ion-input>
          </ion-item>
        </ion-item-group>
      </ion-list>
    </ion-content>
  `
})
export class ModFestivalModal {

  public durationHours = 0;
  public festival: IFestival = { name: '', endTime: 0, startedBy: this.gameService.playerRef.name, stats: { } };

  public get isValidFestival(): boolean {
    return this.festival.name && this.durationHours > 0 && Object.keys(this.festival.stats).length > 0;
  }

  constructor(
    private modalCtrl: ModalController,
    public socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  public create() {
    this.festival.endTime = Date.now() + (1000 * 60 * 60 * this.durationHours);
    this.socketService.emit(ServerEventName.GMStartFestival, { festival: this.festival });
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
