import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ServerEventName } from '../../../shared/interfaces';
import { ToggleMuteModal } from './togglemute.modal';
import { ModTierModal } from './modtier.modal';
import { ModFestivalModal } from './modfestival.modal';

@Component({
  selector: 'app-moderator',
  templateUrl: './moderator.page.html',
  styleUrls: ['./moderator.page.scss'],
})
export class ModeratorPage implements OnInit {

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public gameService: GameService,
    public socketService: SocketClusterService
  ) { }

  ngOnInit() {
    this.gameService.updateOptions();
  }

  async setMOTD() {

    const alert = await this.alertCtrl.create({
      header: 'Change MOTD',
      subHeader: 'Enter the new MOTD for players.',
      inputs: [
        {
          name: 'motd',
          type: 'text',
          placeholder: 'Set MOTD...',
          value: this.gameService.gameSettings.motd || ''
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Set MOTD',
          handler: async (values) => {
            if(!values || !values.motd) return;
            this.socketService.emit(ServerEventName.GMSetMOTD, values);
          }
        }
      ]
    });

    alert.present();
  }

  async toggleMutes() {

    const modal = await this.modalCtrl.create({
      component: ToggleMuteModal
    });

    await modal.present();
  }

  async toggleMods() {

    const modal = await this.modalCtrl.create({
      component: ModTierModal
    });

    await modal.present();
  }

  async createFestival() {

    const modal = await this.modalCtrl.create({
      component: ModFestivalModal
    });

    await modal.present();
  }

}
