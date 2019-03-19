import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-adventure-log',
  templateUrl: './adventure-log.page.html',
  styleUrls: ['./adventure-log.page.scss'],
})
export class AdventureLogPage {

  constructor(
    public gameService: GameService
  ) { }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
