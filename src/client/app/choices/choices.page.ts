import { Component, OnInit, OnDestroy } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { IChoice, ServerEventName } from '../../../shared/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-choices',
  templateUrl: './choices.page.html',
  styleUrls: ['./choices.page.scss'],
})
export class ChoicesPage implements OnInit, OnDestroy {

  private choices$: Subscription;
  public choices: IChoice[] = [];

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  public ngOnInit() {
    this.choices$ = this.gameService.player$.subscribe(player => {
      if(!player.$choicesData) return;
      this.choices = player.$choicesData.choices;
    });
  }

  public ngOnDestroy() {
    if(this.choices$) this.choices$.unsubscribe();
  }

  public choose(choice: IChoice, valueChosen: string) {
    this.socketService.emit(ServerEventName.ChoiceMake, { choiceId: choice.id, valueChosen });
  }

}
