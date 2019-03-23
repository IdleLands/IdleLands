import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IItem, ServerEventName } from '../../../shared/interfaces';
import { SocketClusterService } from '../socket-cluster.service';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Actions</ion-list-header>
      <ion-item button (click)="sellAll()">
        <ion-icon slot="start" [src]="'assets/icon/action-sell.svg'"></ion-icon>
        Sell All
      </ion-item>
    </ion-list>
  `,
})
export class InventoryActionsPopover {

  @Input() public item: IItem;

  constructor(
    private popoverCtrl: PopoverController,
    private socketService: SocketClusterService
  ) {}

  sellAll() {
    this.socketService.emit(ServerEventName.ItemSellAll);
    this.dismiss();
  }

  dismiss() {
    this.popoverCtrl.dismiss();
  }
}
