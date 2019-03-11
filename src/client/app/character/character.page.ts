import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName } from '../../../shared/interfaces';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-character',
  templateUrl: './character.page.html',
  styleUrls: ['./character.page.scss'],
})
export class CharacterPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  changeGender($event) {
    const newGender = $event.detail.value;
    this.socketService.emit(ServerEventName.CharacterGender, { newGender });
  }

  changeTitle($event) {
    const newTitle = $event.detail.value;
    this.socketService.emit(ServerEventName.CharacterTitle, { newTitle });
  }

  async ascend() {
    const alert = await this.alertCtrl.create({
      header: 'Ascend',
      message: `Are you sure you want to ascend?
      You will go back to level 1 and your level cap will go up.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, ascend!', handler: () => {
          this.socketService.emit(ServerEventName.CharacterAscend);
        } }
      ]
    });

    alert.present();
  }

  async showTrail(trail = [{ val: 0, reason: 'None' }], stat: string, total: number) {
    const baseString = trail.map(({ val, reason }) => {
      return `<p>${val > 0 ? '+' + val : val} (${reason})</p>`;
    }).join('\n');

    const resultString = `<p><strong>${total} (Total)</strong></p>`;

    const alert = await this.alertCtrl.create({
      header: `Stat Trail (${stat.toUpperCase()})`,
      message: baseString + resultString,
      buttons: [
        'OK'
      ]
    });

    alert.present();
  }

}
