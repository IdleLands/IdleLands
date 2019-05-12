
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

import { applyPatch } from 'fast-json-patch';
import { get } from 'lodash';
import { BehaviorSubject, combineLatest } from 'rxjs';
import * as Fingerprint from 'fingerprintjs2';

import { SocketClusterService, Status } from './socket-cluster.service';
import { IPlayer } from '../../shared/interfaces/IPlayer';
import { ServerEventName, IAdventureLog, IItem } from '../../shared/interfaces';
import { AuthService } from './auth.service';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public get baseUrl() {
    return `${environment.app.protocol}://${environment.app.hostname}:${environment.app.port}`;
  }

  public get apiUrl() {
    return `${environment.server.protocol}://${environment.server.hostname}:${environment.server.port}`;
  }

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
    private http: HttpClient,
    private alertCtrl: AlertController,
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
    const totalLength = get(this.playerRef, '$statisticsData.Game.Premium.AdventureLogSize', 25);
    if(log.length > totalLength) log.length = totalLength;

    this.adventureLog.next(log);
    this.storage.set('adventureLog', log);
  }

  private setCurrentPlayer(player: IPlayer) {
    this.currentPlayer = player;
    this.setSessionId(this.currentPlayer.sessionId);
    this.setLoggedInId(this.currentPlayer._id);
    this.player.next(player);

    (<any>window).discordGlobalCharacter = player;
  }

  public async init() {
    await this.initUser();

    this.setSessionId(await this.storage.get('sessionId'));
    this.setLoggedInId(await this.storage.get('loggedInId'));
    this.setAdventureLog(await this.storage.get('adventureLog') || []);

      // TODO: stamina is also NaN when you create a new character, dunno why

    this.socketService.status$.subscribe(status => {
      if(status !== Status.Connected) {
        if(!this.currentPlayer) return;

        // clear the current session id if you get disconnected
        this.setSessionId(null);
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
        const storedFingerprint = await this.storage.get('fingerprint');
        if(storedFingerprint) {
          this.userId.next(storedFingerprint);
          return resolve(storedFingerprint);
        }

        const components = await Fingerprint.getPromise();
        const userId = Fingerprint.x64hash128(components.map(x => x.value).join(''), 31);
        this.userId.next(userId);
        await this.storage.set('fingerprint', userId);
        resolve(userId);
      }, 500);
    });
  }

  private removePlayerData() {
    this.authService.logout();
    this.currentPlayer = null;
    this.player.next(null);
    this.setSessionId(null);
    this.setLoggedInId(null);
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

    this.socketService.register(ServerEventName.ItemCompare, ({ newItem, currentItem, choiceId }) => {
      this.itemCompare(newItem, currentItem, choiceId);
    });
  }

  public logout() {
    this.removePlayerData();
    this.socketService.emit(ServerEventName.AuthSignOut);
  }

  public delete() {
    this.socketService.emit(ServerEventName.AuthDelete);
    this.removePlayerData();
  }

  private async itemCompare(newItem: IItem, currentItem: IItem, choiceId?: string) {
    const stats = ['str', 'int', 'dex', 'agi', 'con', 'luk', 'hp', 'xp', 'gold'];

    const newStats = newItem ? newItem.stats : {};
    const curStats = currentItem ? currentItem.stats : {};

    stats.forEach(stat => {
      newStats[stat] = newStats[stat] || 0;
      curStats[stat] = curStats[stat] || 0;
    });

    const baseString = stats.map(stat => {
      let classColor = '';
      let symbol = '→';

      if(newStats[stat] > curStats[stat]) {
        symbol = '↗';
        classColor = 'ion-color-success';
      }

      if(newStats[stat] < curStats[stat]) {
        symbol = '↘';
        classColor = 'ion-color-danger';
      }

      return `
        <tr>
          <td>${curStats[stat]}</td>
          <td class="desc">
            <div class="desc-container ${classColor}">
              <span>${stat.toUpperCase()}</span>
              <span>»</span>
            </div>
          </td>
          <td class="ion-text-right stat-container ${classColor}">
            ${newStats[stat]} ${symbol}
          </td>
        </tr>
      `;
    }).join('');

    const top = `
      <tr><td colspan="3">
        ↓ ${currentItem ? currentItem.name : 'nothing'} [${currentItem ? currentItem.score.toLocaleString() : 0}]
      </td></tr>
    `;

    const bottom = `
      <tr><td colspan="3" class="ion-text-right">
        ${newItem ? newItem.name : 'nothing'} [${newItem ? newItem.score.toLocaleString() : 0}] ↑
      </td></tr>
    `;

    const finalString = '<table class="item-compare-table">' + top + baseString + bottom + '</table>';

    const alert = await this.alertCtrl.create({
      header: `Item Compare (${newItem.type})`,
      cssClass: 'item-compare-modal',
      message: finalString,
      buttons: [
        // { text: 'Cancel' },
        { text: 'Equip', handler: () => {
          if(!choiceId) return;

          this.socketService.emit(ServerEventName.ChoiceMake, { choiceId, valueChosen: 'Yes' });
        } },
        { text: 'Sell', handler: () => {
          if(!choiceId) return;

          this.socketService.emit(ServerEventName.ChoiceMake, { choiceId, valueChosen: 'Sell' });
        } }
      ]
    });

    alert.present();
  }

  public getPlayerLocationsInCurrentMap() {
    return this.http.get(`${this.apiUrl}/api/players?map=${encodeURIComponent(this.currentPlayer.map)}`);
  }

}
