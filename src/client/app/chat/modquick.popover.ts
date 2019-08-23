import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IItem, ServerEventName } from '../../../shared/interfaces';
import { SocketClusterService } from '../socket-cluster.service';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Actions ({{ playerName }})</ion-list-header>
      <ion-item button (click)="quickMute()">
        <ion-icon slot="start" name="egg"></ion-icon>
        Quick Mute (15min)
      </ion-item>
    </ion-list>
  `,
})
export class ModQuickPopover {

  @Input() public playerName: string;

  constructor(
    private popoverCtrl: PopoverController,
    private socketService: SocketClusterService
  ) { }

  quickMute() {
    this.socketService.emit(ServerEventName.GMToggleMute, { playerName: this.playerName, duration: 15 });
    this.dismiss();
  }

  dismiss() {
    this.popoverCtrl.dismiss();
  }
}
