import { Component, OnInit } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-tab-accomplishments',
  templateUrl: './tab-accomplishments.page.html',
  styleUrls: [],
})
export class TabAccomplishmentsPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

}
