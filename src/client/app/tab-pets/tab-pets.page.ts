import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { IAdventure } from '../../../shared/interfaces';

@Component({
  selector: 'app-pets',
  templateUrl: './tab-pets.page.html',
  styleUrls: [],
})
export class PetsPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  public isAnyAdventureComplete(adventures: IAdventure[]) {
    return adventures.some(x => x.finishAt && x.finishAt < Date.now());
  }

}
