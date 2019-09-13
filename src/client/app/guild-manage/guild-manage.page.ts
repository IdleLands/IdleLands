import { Component, OnInit } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';
import { AlertController } from '@ionic/angular';
import { ServerEventName } from '../../../shared/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-guild-manage',
  templateUrl: './guild-manage.page.html',
  styleUrls: ['./guild-manage.page.scss'],
})
export class GuildManagePage implements OnInit {

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  async leave() {
    const alert = await this.alertCtrl.create({
      header: `Leave Guild`,
      message: `Are you sure you want to leave your guild?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, leave!', handler: () => {
          this.socketService.emit(ServerEventName.GuildLeave);
          this.router.navigate(['/character']);
        } }
      ]
    });

    alert.present();
  }

  async kick(kickPlayer) {
    const alert = await this.alertCtrl.create({
      header: `Kick ${kickPlayer}`,
      message: `Are you sure you want to remove this person from your guild?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, kick!', handler: () => {
          this.socketService.emit(ServerEventName.GuildKick, { kickPlayer });

          setTimeout(() => {
            this.gameService.loadGuild();
          }, 3000);
        } }
      ]
    });

    alert.present();
  }

}
