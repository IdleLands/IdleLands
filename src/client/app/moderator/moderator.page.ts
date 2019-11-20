import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ServerEventName, EventName } from '../../../shared/interfaces';
import { ToggleMuteModal } from './togglemute.modal';
import { ModTierModal } from './modtier.modal';
import { ModFestivalModal } from './modfestival.modal';
import { ModItemModal } from './moditem.modal';
import { ModGuildResourcesModal } from './modguildresources.modal';

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

  async giveGuildResources() {

    const modal = await this.modalCtrl.create({
      component: ModGuildResourcesModal
    });

    await modal.present();
  }

  async setPlayerId() {
    const alert = await this.alertCtrl.create({
      header: 'Set Player Id',
      subHeader: `Enter the player name to port from, and the player name to port to.
      Beware, this will only work if both accounts are offline, and will permanently change who logs in as who.
      This is primarily useful if someone didn't sync their account, but would like to get back onto their old character.`,
      inputs: [
        {
          name: 'player',
          type: 'text',
          placeholder: 'Player'
        },
        {
          name: 'newPlayer',
          type: 'text',
          placeholder: 'New Player'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Swap Ids',
          handler: async (values) => {
            if(!values || !values.player || !values.newPlayer) return;
            this.socketService.emit(ServerEventName.GMPortCharacterId, values);
          }
        }
      ]
    });

    alert.present();
  }

  async setStatistic() {
    const alert = await this.alertCtrl.create({
      header: 'Set Statistic',
      subHeader: 'Enter the player name and the statistic.',
      inputs: [
        {
          name: 'player',
          type: 'text',
          placeholder: 'Player'
        },
        {
          name: 'statistic',
          type: 'text',
          placeholder: 'Parent/Child/Child'
        },
        {
          name: 'value',
          type: 'number',
          placeholder: 'Statistic Value (1...x)'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Set Statistic',
          handler: async (values) => {
            if(!values || !values.statistic || !values.player || !values.value) return;
            this.socketService.emit(ServerEventName.GMSetStatistic, values);
          }
        }
      ]
    });

    alert.present();
  }

  async setName() {

    const alert = await this.alertCtrl.create({
      header: 'Set Name',
      subHeader: 'Enter the player name and the new name.',
      inputs: [
        {
          name: 'player',
          type: 'text',
          placeholder: 'Player'
        },
        {
          name: 'newName',
          type: 'text',
          placeholder: 'New Name'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Set Name',
          handler: async (values) => {
            if(!values || !values.newName || !values.player) return;
            this.socketService.emit(ServerEventName.GMSetName, values);
          }
        }
      ]
    });

    alert.present();
  }

  async setClassTarget() {
    const alert = await this.alertCtrl.create({
      header: 'Set Class 1/2',
      subHeader: 'Type the name of the player you want to change the class of.',
      inputs: [{
          name: 'player',
          type: 'text',
          placeholder: 'Player'
        }],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Pick Class...',
          handler: async (values) => {
            this.setClass(values.player)
          }
        }
      ]
    });

    alert.present();
  }

  async setClass(name) {
    const inputData = [];
    const professions = [
      'Archer', 'Barbarian', 'Bard',
      'Bitomancer', 'Cleric', 'Fighter', 'Generalist',
      'Jester', 'Mage', 'MagicalMonster', 'Monster',
      'Necromancer', 'Pirate', 'Rogue', 'SandwichArtist'
    ];

    professions.forEach(profession => {
      inputData.push({
        name: 'newClass',
        type: 'radio',
        label: profession,
        value: profession
      });
    });

    const alert = await this.alertCtrl.create({
      header: 'Set Class 2/2',
      subHeader: `Select ${name}'s new class`,
      inputs: inputData,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Set Class',
          handler: async (newClass) => {
            if(!newClass || !name) return;
            this.socketService.emit(ServerEventName.GMSetClass, {
              newClass: newClass, player: name
            });
          }
        }
      ]
    });

    alert.present();
  }

  async setLevel() {
    const alert = await this.alertCtrl.create({
      header: 'Set Level',
      subHeader: 'Enter the player name and the level.',
      inputs: [
        {
          name: 'player',
          type: 'text',
          placeholder: 'Player'
        },
        {
          name: 'newLevel',
          type: 'number',
          placeholder: 'New Level (1...x)'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Set Level',
          handler: async (values) => {
            if(!values || !values.newLevel || !values.player) return;
            this.socketService.emit(ServerEventName.GMSetLevel, values);
          }
        }
      ]
    });

    alert.present();
  }

  async setLocation() {

  }

  async giveILP() {
    const alert = await this.alertCtrl.create({
      header: 'Give ILP',
      subHeader: 'Enter the player name and the ILP to give.',
      inputs: [
        {
          name: 'player',
          type: 'text',
          placeholder: 'Player'
        },
        {
          name: 'ilp',
          type: 'number',
          placeholder: 'ILP Value'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Give ILP',
          handler: async (values) => {
            if(!values || !values.ilp || !values.player) return;
            this.socketService.emit(ServerEventName.GMGiveILP, values);
          }
        }
      ]
    });

    alert.present();
  }

  async giveGold() {
    const alert = await this.alertCtrl.create({
      header: 'Give Gold',
      subHeader: 'Enter the player name and the gold.',
      inputs: [
        {
          name: 'player',
          type: 'text',
          placeholder: 'Player'
        },
        {
          name: 'gold',
          type: 'number',
          placeholder: 'Gold Value'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Give Gold',
          handler: async (values) => {
            if(!values || !values.gold || !values.player) return;
            this.socketService.emit(ServerEventName.GMGiveGold, values);
          }
        }
      ]
    });

    alert.present();
  }

  async giveItem() {

    const modal = await this.modalCtrl.create({
      component: ModItemModal
    });

    await modal.present();
  }

  async giveEvent() {
    const eventRadios = Object.values(EventName).map(x => {
      return {
        name: 'event',
        type: 'radio',
        label: x as string,
        value: x as string
      };
    });

    const alert = await this.alertCtrl.create({
      header: 'Give Event',
      subHeader: 'Enter the player name and the event.',
      inputs: [
      ].concat(eventRadios),
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Give Event',
          handler: async (values) => {
            if(!values || !values.statistic || !values.player || !values.value) return;
            this.socketService.emit(ServerEventName.GMSetMOTD, values);
          }
        }
      ]
    });

    alert.present();
  }

  async resetGlobal() {

    const alert = await this.alertCtrl.create({
      header: 'Reset Global Quests',
      subHeader: 'Are you sure? This will probably make people unhappy.',
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Yes, reset them',
          handler: async (values) => {
            this.socketService.emit(ServerEventName.GMResetGlobal, values);
          }
        }
      ]
    });

    alert.present();
  }

}
