import { Component, OnInit } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';
import { AlertController } from '@ionic/angular';
import { ServerEventName, GuildMemberTier, IGuildApplication,
  GuildBuilding, GuildBuildingLevelValues } from '../../../shared/interfaces';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { sortBy } from 'lodash';

@Component({
  selector: 'app-guild-manage',
  templateUrl: './guild-manage.page.html',
  styleUrls: ['./guild-manage.page.scss'],
})
export class GuildManagePage implements OnInit {

  public appinvs: IGuildApplication[] = [];

  public get maxMembers(): number {
    return 0; // GuildBuildingLevelValues[GuildBuilding.Academy](this.gameService.guild.buildingLevels[GuildBuilding.Academy]);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private alertCtrl: AlertController,
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.loadData();
  }

  public timeString(milliseconds) {
    return 'unknown';

    /*
    if (!milliseconds) {
      return 'a long time';
    }

    // Time since
    milliseconds = Date.now() - milliseconds;
    const keys = {
      year: 31557600,
      month: 2629800,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    let duration = Math.floor((milliseconds + 500) / 1000);
    const resp = { };
    const stamp = [];

    Object.keys(keys).forEach((key) => {
      resp[key] = Math.floor(duration / keys[key]);
      duration -= resp[key] * keys[key];
      if (resp[key] > 0) {
        stamp.push(`${resp[key]} ${resp[key] === 1 ? key : key + 's'}`);
      }
    });

    return stamp.join(', ');
    */
  }

  loadData() {
    if(!this.gameService.guild) return;

    this.http.get(`${this.gameService.apiUrl}/guilds/appinv`,
      { params: { guildName: this.gameService.guild.name } }
    )
      .pipe(map((x: any) => x.appinvs))
      .subscribe(appinvs => {
        this.appinvs = appinvs;
      });
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
          delete this.gameService.guild.members[kickPlayer];
        } }
      ]
    });

    alert.present();
  }

  async promote(promotePlayer) {
    this.socketService.emit(ServerEventName.GuildPromoteMember, { promotePlayer });
    const curTier = this.gameService.guild.members[promotePlayer].rank;

    let newTier = 0;
    if(curTier === GuildMemberTier.Member) newTier = GuildMemberTier.Moderator;
    if(curTier === GuildMemberTier.Moderator) newTier = GuildMemberTier.Leader;

    this.gameService.guild.members[promotePlayer].rank = newTier;
  }

  async demote(demotePlayer) {
    this.socketService.emit(ServerEventName.GuildDemoteMember, { demotePlayer });
    const curTier = this.gameService.guild.members[demotePlayer].rank;

    let newTier = 0;
    if(curTier === GuildMemberTier.Leader) newTier = GuildMemberTier.Moderator;
    if(curTier === GuildMemberTier.Moderator) newTier = GuildMemberTier.Member;

    this.gameService.guild.members[demotePlayer].rank = newTier;
  }

  async invite() {
    const alert = await this.alertCtrl.create({
      header: `Invite Player`,
      message: `Enter the name of the player you want to invite.`,
      inputs: [
        {
          name: 'playerName',
          type: 'text',
          placeholder: 'Player name...'
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Invite',
          handler: async (values) => {
            if(!values || !values.playerName) return;
            this.socketService.emit(ServerEventName.GuildInvite, values);
          }
        }
      ]
    });

    alert.present();
  }

  cancelInv(appinv: IGuildApplication) {
    this.socketService.emit(ServerEventName.GuildRejectApply, { playerName: appinv.playerName });

    this.appinvs = this.appinvs.filter(x => x.playerName !== appinv.playerName);
  }

  acceptInv(appinv: IGuildApplication) {
    this.socketService.emit(ServerEventName.GuildAcceptApply, { playerName: appinv.playerName });

    this.appinvs = this.appinvs.filter(x => x.playerName !== appinv.playerName);
    this.gameService.guild.members[appinv.playerName].rank = GuildMemberTier.Member;
  }

}
