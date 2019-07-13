import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';

@Component({
  selector: 'app-tab-char',
  templateUrl: './tab-char.page.html',
  styleUrls: [],
})
export class TabCharPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

}
