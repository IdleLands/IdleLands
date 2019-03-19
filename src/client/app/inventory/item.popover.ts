import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IItem, ServerEventName } from '../../../shared/interfaces';
import { SocketClusterService } from '../socket-cluster.service';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Actions</ion-list-header>
      <ion-item button (click)="equip()">
        <ion-icon slot="start" [src]="'assets/icon/action-frominventory.svg'"></ion-icon>
        Equip This
      </ion-item>
      <ion-item button (click)="sell()">
        <ion-icon slot="start" [src]="'assets/icon/action-sell.svg'"></ion-icon>
        Sell This
      </ion-item>
    </ion-list>
    <ion-button expand="block" (click)="dismiss()">Close</ion-button>
  `,
})
export class InventoryItemPopover {

  @Input() public item: IItem;

  constructor(
    private popoverCtrl: PopoverController,
    private socketService: SocketClusterService
  ) {}

  equip() {
    this.socketService.emit(ServerEventName.ItemEquip, { itemId: this.item.id });
    this.dismiss();
  }

  sell() {
    this.socketService.emit(ServerEventName.ItemSell, { itemId: this.item.id });
    this.dismiss();
  }

  dismiss() {
    this.popoverCtrl.dismiss();
  }
}
