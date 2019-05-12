import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-collectibles',
  templateUrl: './collectibles.page.html',
  styleUrls: ['./collectibles.page.scss'],
})
export class CollectiblesPage implements OnInit {

  constructor(
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

}
