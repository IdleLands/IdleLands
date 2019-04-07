import { Component } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName } from '../../../shared/interfaces';

@Component({
  selector: 'app-personalities',
  templateUrl: './personalities.page.html',
  styleUrls: ['./personalities.page.scss'],
})
export class PersonalitiesPage {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  togglePersonality(personalityName: string) {
    this.socketService.emit(ServerEventName.TogglePersonality, { personalityName });
  }

}
