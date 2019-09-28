import { Component, OnInit } from '@angular/core';
import { IPlayer } from '../../../shared/interfaces';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import {UiService} from '../ui.service';

@Component({
  selector: 'app-tab-premium',
  templateUrl: './tab-premium.page.html',
  styleUrls: [],
})
export class TabPremiumPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService,
    public uiService: UiService
  ) { }

  ngOnInit() {
  }
}
