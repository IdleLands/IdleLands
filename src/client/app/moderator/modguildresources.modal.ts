import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName } from '../../../shared/interfaces';

@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar color="primary">
        <ion-title>Give Guild Resources</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="create()">Give</ion-button>
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-list>
        <ion-item-group>
          <ion-list-header>Guild Info</ion-list-header>
          <ion-item>
            <ion-label position="stacked">
              <strong class="stat-fixed-width">Guild Name</strong>
            </ion-label>

            <ion-input type="text" placeholder="Enter guild name here..."
                       [(ngModel)]="guild"></ion-input>
          </ion-item>

        </ion-item-group>

        <ion-item-group>
          <ion-list-header>Stat Boosts</ion-list-header>
          <ion-item *ngFor="let stat of ['gold', 'clay', 'wood', 'stone', 'astralium']">
            <ion-icon slot="start" [src]="'assets/icon/' + (stat === 'gold' ? 'stat' : 'resource') + '-' + stat + '.svg'"></ion-icon>

            <ion-label position="stacked" >
              <strong class="stat-fixed-width">{{ stat.toUpperCase() }}</strong>
            </ion-label>

            <ion-input type="number" [placeholder]="stat.toUpperCase()"
                       [(ngModel)]="resources[stat]"></ion-input>
          </ion-item>
        </ion-item-group>
      </ion-list>
    </ion-content>
  `
})
export class ModGuildResourcesModal {

  public guild: string;
  public resources = { };

  constructor(
    private modalCtrl: ModalController,
    public socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  public create() {
    this.socketService.emit(ServerEventName.GMGiveGuildResrouces,  { guildName: this.guild, ...this.resources });
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
