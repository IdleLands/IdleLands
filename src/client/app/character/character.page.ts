import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName } from '../../../shared/interfaces';

@Component({
  selector: 'app-character',
  templateUrl: './character.page.html',
  styleUrls: ['./character.page.scss'],
})
export class CharacterPage implements OnInit {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
  }

  changeGender($event) {
    const newGender = $event.detail.value;
    this.socketService.emit(ServerEventName.CharacterGender, { newGender });
  }

  changeTitle($event) {
    const newTitle = $event.detail.value;
    this.socketService.emit(ServerEventName.CharacterTitle, { newTitle });
  }

}
