import { Component, Input } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { IItem, ItemSlot } from '../../../../shared/interfaces';
import { EquipSomethingElseModal } from './equipsomethingelse.modal';

@Component({
  template: `
    <ion-list>
      <ion-list-header>Actions</ion-list-header>
      <ion-item button (click)="somethingElse()" *ngIf="somethingElseCallback">
        <ion-icon slot="start" [src]="'assets/icon/action-swap.svg'"></ion-icon>
        Equip Something Else
      </ion-item>
      <ion-item button (click)="unequip()" *ngIf="item && unequipCallback">
        <ion-icon slot="start" [src]="'assets/icon/action-toinventory.svg'"></ion-icon>
        Unequip This
      </ion-item>
      <ion-item button (click)="unlock()" *ngIf="item && item.locked && lockCallback">
        <ion-icon slot="start" [src]="'assets/icon/action-unlock.svg'"></ion-icon>
        Unlock This
        </ion-item>
      <ion-item button (click)="lock()" *ngIf="item && !item.locked && lockCallback">
        <ion-icon slot="start" [src]="'assets/icon/action-lock.svg'"></ion-icon>
        Lock This
      </ion-item>
    </ion-list>
  `,
})
export class EquipmentItemPopover {

  @Input() public item: IItem;
  @Input() public slot: ItemSlot;
  @Input() public somethingElseCallback: Function;
  @Input() public unequipCallback: Function;
  @Input() public lockCallback: Function;

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

  lock() {
    this.lockCallback(this.item, true);
    this.dismiss();
  }

  unlock() {
    this.lockCallback(this.item, false);
    this.dismiss();
  }

  unequip() {
    this.unequipCallback(this.item);
    this.dismiss();
  }

  dismiss() {
    this.popoverCtrl.dismiss();
  }
}
