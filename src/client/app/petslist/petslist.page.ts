import { Component, OnInit } from '@angular/core';
import { SocketClusterService } from '../socket-cluster.service';
import { GameService } from '../game.service';

@Component({
  selector: 'app-petslist',
  templateUrl: './petslist.page.html',
  styleUrls: ['./petslist.page.scss'],
})
export class PetslistPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

}
