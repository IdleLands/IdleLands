import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';

@Component({
  selector: 'app-tab-gear',
  templateUrl: './tab-gear.page.html',
  styleUrls: [],
})
export class TabGearPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

}
