import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName } from '../../../shared/interfaces';

@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar color="primary">
        <ion-title>Toggle Mute</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-list>
        <ion-item *ngFor="let player of gameService.allPlayers">
          <ion-label class="ion-text-wrap">
            <h3>{{ player.name }}</h3>
            <p *ngIf="!player.mutedUntil">Not muted</p>
            <p *ngIf="player.mutedUntil">Muted until {{ player.mutedUntil | date:'medium' }}</p>
          </ion-label>

          <ion-select placeholder="Change time..." #muteThisPlayer
                      class="ion-hide" (ionChange)="changeMute(player, $event)"
                      [interfaceOptions]="{ header: player.name }">
            <ion-select-option value="-1">Unmute</ion-select-option>
            <ion-select-option value="15">Mute for +15 minutes</ion-select-option>
            <ion-select-option value="30">Mute for +30 minutes</ion-select-option>
            <ion-select-option value="60">Mute for +1 hour</ion-select-option>
            <ion-select-option value="360">Mute for +6 hours</ion-select-option>
            <ion-select-option value="1440">Mute for +1 day</ion-select-option>
            <ion-select-option value="10080">Mute for +1 week</ion-select-option>
            <ion-select-option value="9999999">Mute for a long time</ion-select-option>
          </ion-select>

          <ion-button (click)="muteThisPlayer.open()">
            Change
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    ion-select {
      max-width: 30%;
    }
  `]
})
export class ToggleMuteModal {

  constructor(
    private modalCtrl: ModalController,
    public socketService: SocketClusterService,
    public gameService: GameService
  ) {}

  public changeMute(player, $event) {
    const duration = +$event.detail.value;
    const playerName = player.name;

    this.socketService.emit(ServerEventName.GMToggleMute, { playerName, duration });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
