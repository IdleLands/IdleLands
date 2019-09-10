import { Component, OnInit } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-tab-guilds',
  templateUrl: './tab-guilds.page.html',
  styleUrls: ['./tab-guilds.page.scss'],
})
export class TabGuildsPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.gameService.loadGuild();
  }

}
