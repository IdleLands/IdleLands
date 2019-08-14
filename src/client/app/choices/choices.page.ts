import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { IChoice, ServerEventName } from '../../../shared/interfaces';

@Component({
  selector: 'app-choices',
  templateUrl: './choices.page.html',
  styleUrls: ['./choices.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChoicesPage {

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  public choose(choice: IChoice, valueChosen: string) {
    this.socketService.emit(ServerEventName.ChoiceMake, { choiceId: choice.id, valueChosen });
  }

}
