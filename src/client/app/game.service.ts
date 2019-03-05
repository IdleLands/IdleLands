
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { SocketClusterService } from './socket-cluster.service';
import { IPlayer } from '../../shared/interfaces/IPlayer';
import { ServerEventName } from '../../shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  private player: BehaviorSubject<IPlayer> = new BehaviorSubject<IPlayer>({});
  private playerObs: Observable<IPlayer>;
  public get player$() {
    return this.playerObs;
  }

  constructor(private socketService: SocketClusterService) {
    this.init();
  }

  private init() {
    this.playerObs = this.player.asObservable();

    this.socketService.register(ServerEventName.CharacterSync, (char) => {
      this.player.next(char);
    });
  }

}
