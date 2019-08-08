import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName } from '../../../shared/interfaces';

@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar color="primary">
        <ion-title>Moderators</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-list>
        <ion-item *ngFor="let player of gameService.players">
          <ion-icon slot="start" *ngIf="!player.modTier" name="square"></ion-icon>
          <ion-icon slot="start" *ngIf="player.modTier === 1" name="star-outline"></ion-icon>
          <ion-icon slot="start" *ngIf="player.modTier === 2" name="star-half"></ion-icon>
          <ion-icon slot="start" *ngIf="player.modTier === 5" name="star"></ion-icon>

          <ion-label class="ion-text-wrap">
            <h3>{{ player.name }}</h3>
          </ion-label>

          <div slot="end">
            <ion-button (click)="demote(player)" *ngIf="!player.modTier || player.modTier < 5" [disabled]="!player.modTier">
              Demote
            </ion-button>

            <ion-button (click)="promote(player)" *ngIf="!player.modTier || player.modTier < 5" [disabled]="player.modTier === 2">
              Promote
            </ion-button>
          </div>
        </ion-item>
      </ion-list>
    </ion-content>
  `
})
export class ModTierModal {

  constructor(
    private modalCtrl: ModalController,
    public socketService: SocketClusterService,
    public gameService: GameService
  ) {}

  public demote(player) {
    const playerName = player.name;

    player.modTier = player.modTier || 0;
    const newTier = player.modTier - 1;

    this.socketService.emit(ServerEventName.GMChangeModTier, { playerName, newTier });
  }

  public promote(player) {
    const playerName = player.name;

    player.modTier = player.modTier || 0;
    const newTier = player.modTier + 1;

    this.socketService.emit(ServerEventName.GMChangeModTier, { playerName, newTier });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
