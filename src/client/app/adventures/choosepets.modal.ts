import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GameService } from '../game.service';
import { Storage } from '@ionic/storage';

@Component({
  template: `
    <ion-header translucent>
      <ion-toolbar color="primary">
        <ion-title>Choose Pets For Adventure</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">{{ dismissLabel() }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>
      <ng-container *ngIf="(gameService.player$ | async) as player">
        <ion-list *ngIf="player.$petsData.allPets as petHash">
          <ng-container *ngIf="petHash[pet]">
            <ion-item *ngFor="let pet of petOrder">
              <app-gendervatar slot="start" [gender]="petHash[pet].gender"></app-gendervatar>

              <ion-label>
                <h3>
                  {{ petHash[pet].name }}, the {{ petHash[pet].attribute }} {{ petHash[pet].affinity }}
                </h3>
                <p class="vertical-center">
                  Level {{ petHash[pet].level.__current }}/{{ petHash[pet].level.maximum }}
                  &nbsp;
                  <ion-badge color="tertiary">{{ petHash[pet].rating }}★{{ pet }}</ion-badge>
                </p>
              </ion-label>

              <ion-checkbox slot="end"
                            [(ngModel)]="chosenPets[pet]"
                            [disabled]="petHash[pet].currentAdventureId || (!chosenPets[pet] && !canChoosePets())"></ion-checkbox>
            </ion-item>
          </ng-container>
        </ion-list>
      </ng-container>
    </ion-content>
  `,
})
export class ChoosePetsModal implements OnInit, OnDestroy {

  private pets$: any;

  public petOrder: any[] = [];
  public chosenPets: any = {};

  constructor(
    private storage: Storage,
    private modalCtrl: ModalController,
    public gameService: GameService
  ) {}

  async ngOnInit() {
    this.petOrder = (await this.storage.get('petOrder')) || [];

    this.pets$ = this.gameService.player$.subscribe(player => {
      if(!player) return;

      if(this.petOrder.length === 0) {
        this.petOrder = Object.keys(player.$petsData.allPets);
      }
    });
  }

  ngOnDestroy() {
    if(this.pets$) this.pets$.unsubscribe();
  }

  public dismissLabel() {
    return Object.values(this.chosenPets).filter(Boolean).length === 0 ? 'Cancel' : 'Embark';
  }

  public canChoosePets() {
    return Object.values(this.chosenPets).filter(Boolean).length < 3;
  }

  dismiss() {
    this.modalCtrl.dismiss(Object.keys(this.chosenPets).filter(x => this.chosenPets[x]));
  }
}
