import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';
import { ServerEventName, IGuild, IGuildApplication, CalculateGuildLevel } from '../../../shared/interfaces';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-guild-none',
  templateUrl: './guild-none.page.html',
  styleUrls: ['./guild-none.page.scss'],
})
export class GuildNonePage implements OnInit {

  public isLoading: boolean;
  public guilds: IGuild[] = [];
  public appinvs: IGuildApplication[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.loadData();
  }

  loadData() {
    forkJoin(
      [
        this.http.get(`${this.gameService.apiUrl}/guilds/all`).pipe(map((x: any) => x.guilds)),
        this.http.get(`${this.gameService.apiUrl}/guilds/appinv`,
          { params: { playerName: this.gameService.playerRef.name } }
        ).pipe(map((x: any) => x.appinvs))
      ]
    )
      .subscribe(([guilds, appinvs]) => {
        this.isLoading = false;
        this.guilds = guilds;
        this.appinvs = appinvs;
      });
  }

  async makeGuild() {
    const alert = await this.alertCtrl.create({
      header: 'Create Guild',
      subHeader: 'Creating a guild will cost 100m gold. Enter the guild name and tag below!',
      inputs: [
        {
          name: 'guildName',
          type: 'text',
          placeholder: 'Guild Name [20 or less characters]'
        },
        {
          name: 'guildTag',
          type: 'text',
          placeholder: 'Guild Tag [5 or less characters]'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Create Guild',
          handler: async (values) => {
            if(!values || !values.guildName || !values.guildTag) return;
            this.socketService.emit(ServerEventName.GuildCreate, values);

            setTimeout(() => {
              this.router.navigate(['guild', 'overview']);
            }, 3000);
          }
        }
      ]
    });

    alert.present();
  }

  public guildLevel(guild: IGuild) {
    return CalculateGuildLevel(guild);
  }

  async cancelInv(appinv: IGuildApplication) {
    this.socketService.emit(ServerEventName.GuildRemoveApplyInvite, { guildName: appinv.guildName });

    this.appinvs = this.appinvs.filter(x => x.guildName !== appinv.guildName);
  }

  async apply(guild: IGuild) {
    this.socketService.emit(ServerEventName.GuildApplyJoin, { guildName: guild.name });

    if(guild.recruitment === 'Open') {
      setTimeout(() => {
        this.router.navigate(['guild', 'overview']);
      }, 3000);

      return;
    }

    this.loadData();
  }

}
