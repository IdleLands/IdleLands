import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { AlertController } from '@ionic/angular';
import { CalculateGuildLevel, ServerEventName } from '../../../shared/interfaces';

@Component({
  selector: 'app-guild-overview',
  templateUrl: './guild-overview.page.html',
  styleUrls: ['./guild-overview.page.scss'],
})
export class GuildOverviewPage implements OnInit {

  public level = CalculateGuildLevel;

  public crystals = [
    { name: 'Red',    color: '#a00' },
    { name: 'Orange', color: '#fa5' },
    { name: 'Yellow', color: '#aa0' },
    { name: 'Green',  color: '#0a0' },
    { name: 'Blue',   color: '#00a' },
    { name: 'Purple', color: '#a0a' },
    { name: 'Astral' }
  ];

  constructor(
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  async updateMOTD() {
    const alert = await this.alertCtrl.create({
      header: 'Change MOTD',
      subHeader: 'Enter the new MOTD for guild members.',
      inputs: [
        {
          name: 'motd',
          type: 'text',
          placeholder: 'Set MOTD...',
          value: this.gameService.guild.motd || ''
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Set MOTD',
          handler: async (values) => {
            if(!values || !values.motd) return;
            this.gameService.guild.motd = values.motd;
            this.socketService.emit(ServerEventName.GuildSetMOTD, { newMOTD: values.motd });
          }
        }
      ]
    });

    alert.present();
  }

  changeRecruitment($event) {
    this.gameService.guild.recruitment = $event.detail.value;
    this.socketService.emit(ServerEventName.GuildSetRecruitment, { newMode: $event.detail.value });
  }

  updateTax(resource, $event) {
    this.gameService.guild.taxes[resource] = $event.detail.value;
    this.socketService.emit(ServerEventName.GuildSetTax, { resource, newTax: $event.detail.value });
  }

  async donate(resource) {
    let defaultValue = 0;

    if(resource === 'gold') {
      defaultValue = this.gameService.playerRef.gold;
    }

    if(['astralium', 'wood', 'clay', 'stone'].includes(resource)) {
      defaultValue = this.gameService.playerRef.$inventoryData.resources[resource];
    }

    if(['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Astral'].includes(resource)) {
      defaultValue = this.gameService.playerRef.$petsData.ascensionMaterials[`Crystal${resource}`];
    }

    const alert = await this.alertCtrl.create({
      header: `Donate ${resource}`,
      subHeader: 'How much would you like to donate?',
      inputs: [
        {
          name: 'value',
          type: 'number',
          placeholder: 'Choose amount...',
          value: defaultValue
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Donate Resource',
          handler: async (values) => {
            if(!values || !values.value || isNaN(+values.value) || !isFinite(+values.value) || +values.value <= 0) return;

            if(['astralium', 'wood', 'clay', 'stone', 'gold'].includes(resource)) {
              this.gameService.guild.resources[resource] += +values.value;
              this.socketService.emit(ServerEventName.GuildDonateResource, { resource, amount: +values.value });
            }

            if(['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Astral'].includes(resource)) {
              this.gameService.guild.crystals[`Crystal${resource}`] += +values.value;
              this.socketService.emit(ServerEventName.GuildDonateCrystal, { crystal: resource, amount: +values.value });
            }
          }
        }
      ]
    });

    alert.present();
  }

}
