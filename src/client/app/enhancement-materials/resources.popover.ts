import { Component, Input } from '@angular/core';

import { PopoverController } from '@ionic/angular';

import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Actions</ion-list-header>

      <ion-item (click)="donateAll()" button>
        <ion-icon slot="start" name="share"></ion-icon> Donate all
      </ion-item>
    </ion-list>
  `
})
export class ResourcesPopover {
  @Input() public donateAllCallback: Function;

  constructor(
    private popoverCtrl: PopoverController,
    public gameService: GameService,
    private socketService: SocketClusterService
  ) { }

  donateAll() {
    this.donateAllCallback();
    this.dismiss();
  }

  dismiss() {
    this.popoverCtrl.dismiss();
  }
}
