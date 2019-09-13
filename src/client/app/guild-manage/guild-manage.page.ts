import { Component, OnInit } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';
import { AlertController } from '@ionic/angular';
import { ServerEventName, GuildMemberTier, IGuildApplication } from '../../../shared/interfaces';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-guild-manage',
  templateUrl: './guild-manage.page.html',
  styleUrls: ['./guild-manage.page.scss'],
})
export class GuildManagePage implements OnInit {

  public appinvs: IGuildApplication[] = [];

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
    const curTier = this.gameService.guild.members[promotePlayer];

    let newTier = 0;
    if(curTier === GuildMemberTier.Member) newTier = GuildMemberTier.Moderator;
    if(curTier === GuildMemberTier.Moderator) newTier = GuildMemberTier.Leader;

    this.gameService.guild.members[promotePlayer] = newTier;
  }

  async demote(demotePlayer) {
    this.socketService.emit(ServerEventName.GuildDemoteMember, { demotePlayer });
    const curTier = this.gameService.guild.members[demotePlayer];

    let newTier = 0;
    if(curTier === GuildMemberTier.Leader) newTier = GuildMemberTier.Moderator;
    if(curTier === GuildMemberTier.Moderator) newTier = GuildMemberTier.Member;

    this.gameService.guild.members[demotePlayer] = newTier;
  }

  cancelInv(appinv: IGuildApplication) {

  }

  acceptInv(appinv: IGuildApplication) {

  }

}
