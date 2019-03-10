
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { applyPatch } from 'fast-json-patch';

import { BehaviorSubject, combineLatest } from 'rxjs';
import * as Fingerprint from 'fingerprintjs2';

import { SocketClusterService, Status } from './socket-cluster.service';
import { IPlayer } from '../../shared/interfaces/IPlayer';
import { ServerEventName } from '../../shared/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private currentPlayer: IPlayer;
  public get hasPlayer(): boolean {
    return !!this.currentPlayer;
  }

  private sessionId: string;
  public get session(): string {
    return this.sessionId;
  }

  private loggedInId: string;
  public get loggedIn(): string {
    return this.loggedInId;
  }

  private userId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public get userId$() {
    return this.userId;
  }

  private player: BehaviorSubject<IPlayer> = new BehaviorSubject<IPlayer>(null);
  public get player$() {
    return this.player;
  }

  public get status$() {
    return this.socketService.status$;
  }

  constructor(
    private storage: Storage,
    private authService: AuthService,
    private socketService: SocketClusterService
  ) {}

  private setSessionId(id: string) {
    this.sessionId = id;
    this.storage.set('sessionId', id);
  }

  private setLoggedInId(id: string) {
    this.loggedInId = id;
    this.storage.set('loggedInId', id);
  }

  private setCurrentPlayer(player: IPlayer) {
    this.currentPlayer = player;
    this.setSessionId(this.currentPlayer.sessionId);
    this.setLoggedInId(this.currentPlayer._id);
    this.player.next(player);
  }

  public async init() {
    await this.initUser();

    this.setSessionId(await this.storage.get('sessionId'));
    this.setLoggedInId(await this.storage.get('loggedInId'));

    combineLatest(
      this.authService.user$,
      this.socketService.status$,
      this.player$
    ).subscribe(async ([user, status, player]) => {
      if(status !== Status.Connected || !player || !user) return;
      if(user.uid === player.authId) return;

      this.socketService.emit(ServerEventName.AuthSyncAccount, { token: await user.getIdToken() });
    });

    this.socketService.status$.subscribe(status => {
      if(status !== Status.Connected || !this.currentPlayer) return;

      this.socketService.emit(ServerEventName.PlayGame, {
        userId: this.userId$.value,
        relogin: true
      });
    });

    this.socketService.register(ServerEventName.CharacterSync, (char) => {
      this.setCurrentPlayer(char);
    });

    this.socketService.register(ServerEventName.CharacterPatch, (patches) => {
      const newPlayer = applyPatch(this.currentPlayer, patches).newDocument;
      this.setCurrentPlayer(newPlayer);
    });

    if(this.sessionId) {
      this.socketService.emit(ServerEventName.PlayGame, {
        sessionId: this.sessionId,
        userId: this.userId$.value
      });
    }
  }

  private async initUser() {
    return new Promise(resolve => {
      setTimeout(async () => {
        const components = await Fingerprint.getPromise();
        const userId = Fingerprint.x64hash128(components.map(x => x.value).join(''), 31);
        this.userId.next(userId);
        resolve(userId);
      }, 500);
    });
  }

  private removePlayerData() {
    this.currentPlayer = null;
    this.player.next(null);
    this.setSessionId(null);
    this.setLoggedInId(null);
    this.authService.logout();
  }

  public logout() {
    this.socketService.emit(ServerEventName.AuthSignOut);
    this.removePlayerData();
  }

  public delete() {
    this.socketService.emit(ServerEventName.AuthDelete);
    this.removePlayerData();
  }

}
