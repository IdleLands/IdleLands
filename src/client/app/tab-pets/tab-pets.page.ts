import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { UiService } from '../ui.service';

@Component({
  selector: 'app-pets',
  templateUrl: './tab-pets.page.html',
  styleUrls: [],
})
export class PetsPage {

  constructor(
    public gameService: GameService,
    public uiService: UiService
  ) { }
}
