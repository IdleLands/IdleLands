
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { applyPatch } from 'fast-json-patch';
import { get } from 'lodash';
import { BehaviorSubject, combineLatest } from 'rxjs';
import * as Fingerprint from 'fingerprintjs2';

import { SocketClusterService, Status } from './socket-cluster.service';
import { IPlayer } from '../../shared/interfaces/IPlayer';
import { ServerEventName, IAdventureLog } from '../../shared/interfaces';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private currentPlayer: IPlayer;
  public get hasPlayer(): boolean {
    return !!this.currentPlayer;
  }
  public get playerRef(): IPlayer {
    return this.currentPlayer;
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

  private adventureLog: BehaviorSubject<IAdventureLog[]> = new BehaviorSubject<IAdventureLog[]>([]);
  public get adventureLog$() {
    return this.adventureLog;
  }

  public get loggedInAndConnected(): boolean {
    if(!this.currentPlayer) return false;
    return this.sessionId === this.currentPlayer.sessionId && this.socketService.status$.value === Status.Connected;
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

  private setAdventureLog(log: IAdventureLog[]) {
    const totalLength = get(this.playerRef, '$statisticsData.Game.Premium.AdventureLog', 25);
    if(log.length > totalLength) log.length = totalLength;

    this.adventureLog.next(log);
    this.storage.set('adventureLog', log);
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
    this.setAdventureLog(await this.storage.get('adventureLog') || []);

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
      if(status !== Status.Connected) {
        if(!this.currentPlayer) return;

        // clear the current session id if you get disconnected
        delete this.currentPlayer.sessionId;
        return;
      }

      this.socketService.emit(ServerEventName.PlayGame, {
        userId: this.userId$.value,
        relogin: true
      });
    });

    this.initCharacterWatches();

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

  private initCharacterWatches() {
    this.socketService.register(ServerEventName.CharacterSync, (char) => {
      this.setCurrentPlayer(char);
    });

    this.socketService.register(ServerEventName.CharacterPatch, (patches) => {
      if(!this.currentPlayer || !patches) return;

      // these errors are usually just invalid patches, which is whatever
      try {
        const newPlayer = applyPatch(this.currentPlayer, patches).newDocument;
        this.setCurrentPlayer(newPlayer);
      } catch(e) {}
    });

    this.socketService.register(ServerEventName.AdventureLogAdd, (advData) => {
      const log = this.adventureLog.getValue();
      log.unshift(advData);
      this.setAdventureLog(log);
    });
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
