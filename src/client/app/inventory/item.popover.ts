import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IItem, ServerEventName } from '../../../shared/interfaces';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';

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
      <ion-item button (click)="unlock()" *ngIf="item.locked">
        <ion-icon slot="start" [src]="'assets/icon/action-unlock.svg'"></ion-icon>
        Unlock This
        </ion-item>
      <ion-item button (click)="lock()" *ngIf="!item.locked">
        <ion-icon slot="start" [src]="'assets/icon/action-lock.svg'"></ion-icon>
        Lock This
      </ion-item>
      <ion-item button (click)="compare()">
        <ion-icon slot="start" [src]="'assets/icon/action-compare.svg'"></ion-icon>
        Compare This
      </ion-item>
    </ion-list>
  `,
})
export class InventoryItemPopover {

  @Input() public item: IItem;

  constructor(
    private popoverCtrl: PopoverController,
    private gameService: GameService,
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

  lock() {
    this.socketService.emit(ServerEventName.ItemLock, { itemId: this.item.id });
    this.dismiss();
  }

  unlock() {
    this.socketService.emit(ServerEventName.ItemUnlock, { itemId: this.item.id });
    this.dismiss();
  }

  compare() {
    const curItem = this.gameService.playerRef.$inventoryData.equipment[this.item.type];
    this.gameService.itemCompare(this.item, curItem);
    this.dismiss();
  }

  dismiss() {
    this.popoverCtrl.dismiss();
  }
}
