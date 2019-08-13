import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName, ItemClass, GenerateableItemSlot } from '../../../shared/interfaces';

@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar color="primary">
        <ion-title>Create Item</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="create()" [disabled]="!isValid">Create</ion-button>
          <ion-button (click)="dismiss()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ion-list>
        <ion-item-group>
          <ion-list-header>Metadata</ion-list-header>
          <ion-item>
            <ion-label position="stacked">
              <strong class="stat-fixed-width">Player Name</strong>
            </ion-label>

            <ion-input type="text" placeholder="Enter player name here..."
                       [(ngModel)]="playerName"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              <strong class="stat-fixed-width">Item Name</strong>
            </ion-label>

            <ion-input type="text" placeholder="Enter item name here..."
                       [(ngModel)]="itemName"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              <strong class="stat-fixed-width">Item Slot</strong>
            </ion-label>

            <ion-select [(ngModel)]="itemSlot">
              <ion-select-option *ngFor="let slot of allItemSlots">{{ slot }}</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">
              <strong class="stat-fixed-width">Item Class</strong>
            </ion-label>

            <ion-select [(ngModel)]="itemClass">
              <ion-select-option *ngFor="let slot of allItemClasses">{{ slot }}</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-item-group>

        <ion-item-group>
          <ion-list-header>Stat Boosts</ion-list-header>
          <ion-item *ngFor="let stat of ['str', 'int', 'dex', 'agi', 'con', 'luk', 'hp', 'xp', 'gold']">
            <ion-icon slot="start" [src]="'assets/icon/stat-' + stat + '.svg'"></ion-icon>

            <ion-label position="stacked" >
              <strong class="stat-fixed-width">{{ stat.toUpperCase() }}</strong>
            </ion-label>

            <ion-input type="number" [placeholder]="stat.toUpperCase()"
                       [(ngModel)]="itemStats[stat]"></ion-input>
          </ion-item>
        </ion-item-group>
      </ion-list>
    </ion-content>
  `
})
export class ModItemModal {

  public allItemClasses = Object.values(ItemClass);
  public allItemSlots = GenerateableItemSlot;

  public playerName: string;
  public itemName: string;
  public itemClass: string;
  public itemSlot: string;
  public itemStats = {};

  public get isValid(): boolean {
    return !!(this.itemName && this.playerName && this.itemClass && this.itemSlot);
  }

  constructor(
    private modalCtrl: ModalController,
    public socketService: SocketClusterService,
    public gameService: GameService
  ) {}

  public create() {
    const item = {
      name: this.itemName,
      type: this.itemSlot,
      itemClass: this.itemClass,
      stats: this.itemStats
    };

    this.socketService.emit(ServerEventName.GMGiveItem, { player: this.playerName, item });
    this.dismiss();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
