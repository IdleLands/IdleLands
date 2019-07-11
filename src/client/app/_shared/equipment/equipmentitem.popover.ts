import { Component, Input } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { IItem, ItemSlot } from '../../../../shared/interfaces';
import { SocketClusterService } from '../../socket-cluster.service';
import { EquipSomethingElseModal } from './equipsomethingelse.modal';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Actions</ion-list-header>
      <ion-item button (click)="somethingElse()">
        <ion-icon slot="start" [src]="'assets/icon/action-swap.svg'"></ion-icon>
        Equip Something Else
      </ion-item>
      <ion-item button (click)="unequip()" *ngIf="item">
        <ion-icon slot="start" [src]="'assets/icon/action-toinventory.svg'"></ion-icon>
        Unequip This
      </ion-item>
    </ion-list>
  `,
})
export class EquipmentItemPopover {

  @Input() public item: IItem;
  @Input() public slot: ItemSlot;
  @Input() public somethingElseCallback: Function = () => {};
  @Input() public unequipCallback: Function = () => {};

  constructor(
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
  ) {}

  async somethingElse() {
    const modal = await this.modalCtrl.create({
      component: EquipSomethingElseModal,
      componentProps: { item: this.item, slot: this.slot, equipCallback: this.somethingElseCallback }
    });

    this.dismiss();
    return await modal.present();
  }

  unequip() {
    this.unequipCallback(this.item);
    this.dismiss();
  }

  dismiss() {
    this.popoverCtrl.dismiss();
  }
}
