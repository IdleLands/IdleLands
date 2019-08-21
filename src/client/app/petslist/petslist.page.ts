import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';
import { AlertController } from '@ionic/angular';
import { ServerEventName, IPet } from '../../../shared/interfaces';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-petslist',
  templateUrl: './petslist.page.html',
  styleUrls: ['./petslist.page.scss'],
})
export class PetslistPage implements OnInit, OnDestroy {

  public petOrder: any[] = [];
  public petHash: any = {};
  public pets$: Subscription;

  constructor(
    private router: Router,
    private storage: Storage,
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  async ngOnInit() {
    this.petOrder = (await this.storage.get('petOrder')) || [];

    this.pets$ = this.gameService.player$.subscribe(player => {
      if(!player) return;

      this.petHash = player.$petsData.allPets;
      this.checkForNewPetsAndAddToList(this.petHash);
    });
  }

  async ngOnDestroy() {
    if(this.pets$) this.pets$.unsubscribe();
  }

  async reorderPets($event) {
    $event.detail.complete(this.petOrder);
    await this.storage.set('petOrder', this.petOrder);
  }

  public checkForNewPetsAndAddToList(pets) {
    const numPetsEarned = Object.keys(pets).length;

    if(numPetsEarned !== this.petOrder.length) {
      Object.keys(pets).forEach(petKey => {
        if(this.petOrder.includes(petKey)) return;

        this.petOrder.push(petKey);
      });

      this.storage.set('petOrder', this.petOrder);
    }
  }

  activate(petType: string) {
    this.socketService.emit(ServerEventName.PetSwap, { petType });
    this.router.navigate(['/pets', 'current']);
  }

  async buyPet(petType: string) {
    const alert = await this.alertCtrl.create({
      header: 'Buy Pet',
      message: `Are you sure you want to buy ${petType}?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, buy it!', handler: () => {
          this.socketService.emit(ServerEventName.PetBuy, { petType });
          this.router.navigate(['/pets', 'current']);
        } }
      ]
    });

    alert.present();
  }

  // both of these are -1 to account for the soul
  public getPetCurrentEquipped(pet: IPet) {
    return Object.values(pet.equipment).reduce((prev, cur) => prev.concat(cur), []).filter(Boolean).length - 1;
  }

  public getPetMaxEquipped(pet: IPet) {
    return Object.values(pet.equipment).reduce((prev, cur) => prev.concat(cur), []).length - 1;
  }

  public petGatherStatus(pet: IPet) {
    if(!pet.gatherTick) return null;

    if(pet.gatherTick <= Date.now()) return { color: 'success', status: 'Ready to Gather!' };

    return { color: 'secondary', status: `Gather at ${new Date(pet.gatherTick).toLocaleString()}` };
  }

}
