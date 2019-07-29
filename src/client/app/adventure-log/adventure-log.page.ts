import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GameService } from '../game.service';

@Component({
  selector: 'app-adventure-log',
  templateUrl: './adventure-log.page.html',
  styleUrls: ['./adventure-log.page.scss'],
})
export class AdventureLogPage {

  constructor(
    private router: Router,
    public gameService: GameService
  ) { }

  openLink(link: string) {
    window.open(link, '_blank');
  }

  openCombat(combat: string) {
    this.router.navigate(['/combat', combat]);
  }
}
