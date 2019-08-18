import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';

@Component({
  selector: 'app-quests-global',
  templateUrl: './quests-global.page.html',
  styleUrls: ['./quests-global.page.scss'],
})
export class QuestsGlobalPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

}
