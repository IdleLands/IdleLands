import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-personalities',
  templateUrl: './personalities.page.html',
  styleUrls: ['./personalities.page.scss'],
})
export class PersonalitiesPage {

  constructor(public gameService: GameService) { }

}
