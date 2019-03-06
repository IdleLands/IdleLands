import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private router: Router, private gameService: GameService) {}

  async canActivate(): Promise<boolean> {
    const hasPlayer = this.gameService.hasPlayer;
    const id = this.gameService.loggedIn;

    // if we do not have a player...
    if(!hasPlayer) {

      // but if we do have an id, we're still cool. we just need to load when we get into the interface.
      if(id) return true;

      // but if we don't have an id, we're probably not logged in at all
      this.router.navigate(['/home']);
    }

    return hasPlayer;
  }
}
