import { Component, OnInit } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';
import { AlertController } from '@ionic/angular';
import { ServerEventName } from '../../../shared/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-petslist',
  templateUrl: './petslist.page.html',
  styleUrls: ['./petslist.page.scss'],
})
export class PetslistPage implements OnInit {

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
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

}
