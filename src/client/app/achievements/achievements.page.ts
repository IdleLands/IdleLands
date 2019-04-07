import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
})
export class AchievementsPage {

  constructor(public gameService: GameService) { }

}
