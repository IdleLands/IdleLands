import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';

@Component({
  selector: 'app-petcurrent',
  templateUrl: './petcurrent.page.html',
  styleUrls: ['./petcurrent.page.scss'],
})
export class PetcurrentPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

}
