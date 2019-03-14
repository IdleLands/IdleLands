import { Component, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { IItem, ServerEventName } from '../../../shared/interfaces';
import { SocketClusterService } from '../socket-cluster.service';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Actions</ion-list-header>
      <ion-item button>Equip Something Else</ion-item>
      <ion-item button (click)="unequip()">Unequip This</ion-item>
    </ion-list>
    <ion-button expand="block" (click)="dismiss()">Close</ion-button>
  `,
})
export class EquipmentItemPopover {

  @Input() public item: IItem;

  constructor(
    private popoverCtrl: PopoverController,
    private socketService: SocketClusterService
  ) {}

  unequip() {
    this.socketService.emit(ServerEventName.ItemUnequip, { itemSlot: this.item.type });
    this.dismiss();
  }

  dismiss() {
    this.popoverCtrl.dismiss();
  }
}
