
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, IonMenu } from '@ionic/angular';

import * as uuid from 'uuid/v4';
import { applyPatch } from 'fast-json-patch';
import { get, pullAllBy, merge, find, uniqBy, sortBy, cloneDeep } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import * as Fingerprint from 'fingerprintjs2';

import { SocketClusterService, Status } from './socket-cluster.service';
import { IPlayer } from '../../shared/interfaces/IPlayer';
import { ServerEventName, IAdventureLog, IItem, Channel, PlayerChannelOperation, IMessage,
  GachaNameReward, IChoice } from '../../shared/interfaces';
import { AuthService } from './auth.service';

import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public notificationSettings: any;
  public theme: string;

  public get baseUrl() {
    return `${environment.app.protocol}://${environment.app.hostname}:${environment.app.port}`;
  }

  public get apiUrl() {
    return `${environment.server.protocol}://${environment.server.hostname}:${environment.server.port}/api`;
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

  private allPlayers: any[] = [];
  public get players(): any[] {
    return this.allPlayers;
  }

  public playerInfoHash: any = {};

  private allMessages: IMessage[] = [];
  public get messages(): IMessage[] {
    return this.allMessages;
  }

  private newMessages = 0;
  public get unreadMessages(): number {
    return this.newMessages;
  }

  public playerMenu: IonMenu;

  public gameSettings: any = {};

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private storage: Storage,
    private authService: AuthService,
    private socketService: SocketClusterService
  ) {}

  public changeTheme(theme: string) {
    this.storage.set('theme', theme);
    this.theme = theme;

    const root = document.querySelector(':root');
    root.classList.forEach(cls => {
      if(!cls.includes('theme')) return;
      root.classList.remove(cls);
    });

    root.classList.add(`theme-${theme}`);
  }

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
    if(this.currentPlayer && !player.$achievementsData) return;

    const curPlayer = this.currentPlayer;

    this.currentPlayer = player;
    this.setSessionId(this.currentPlayer.sessionId);
    this.setLoggedInId(this.currentPlayer._id);
    this.player.next(player);

    this.checkPlayerUpdatesForNotifications(curPlayer, player);

    (<any>window).discordGlobalCharacter = player;
  }

  public async init() {
    await this.initUser();

    this.notificationSettings = await this.storage.get('notifications') || {};
    this.changeTheme(await this.storage.get('theme') || 'Default');

    this.setSessionId(await this.storage.get('sessionId'));
    this.setLoggedInId(await this.storage.get('loggedInId'));
    this.setAdventureLog(await this.storage.get('adventureLog') || []);

    this.allMessages = await this.storage.get('lastMessages') || [];

    this.socketService.status$.subscribe(status => {
      if(status !== Status.Connected) {
        if(!this.currentPlayer) return;

        this.allPlayers = [];

        // clear the current session id if you get disconnected
        this.setSessionId(null);
        delete this.currentPlayer.sessionId;
        return;
      }

      setTimeout(() => {
        this.socketService.emit(ServerEventName.PlayGame, {
          userId: this.userId$.value,
          relogin: true
        });
      }, 1000);
    });

    this.initCharacterWatches();

    if(this.sessionId) {
      setTimeout(() => {
        this.socketService.emit(ServerEventName.PlayGame, {
          sessionId: this.sessionId,
          userId: this.userId$.value
        });
      }, 1000);
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
        const userId = Fingerprint.x64hash128(components.map(x => x.value).join(''), 31) + uuid();
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

  private sortAndUniqPlayerList() {
    this.allPlayers = sortBy(uniqBy(this.allPlayers, p => p.name), p => p.name.toLowerCase());
  }

  private refreshPlayerInfoHash() {
    this.playerInfoHash = {};
    this.allPlayers.forEach(p => this.playerInfoHash[p.name] = p);
  }

  private initCharacterWatches() {
    this.socketService.register(ServerEventName.PlayGame, () => {
      this.socketService.emit(ServerEventName.ChatPlayerListSync);
    });

    this.socketService.register(ServerEventName.CharacterSync, (char) => {
      if(!char.loggedIn) return;
      this.setCurrentPlayer(char);
    });

    this.socketService.register(ServerEventName.CharacterPatch, (patches) => {
      if(!this.currentPlayer || !patches) return;

      // these errors are usually just invalid patches, which is whatever
      try {
        const newPlayer = applyPatch(cloneDeep(this.currentPlayer), patches).newDocument;
        this.setCurrentPlayer(newPlayer);
      } catch(e) {}
    });

    this.socketService.register(ServerEventName.AdventureLogAdd, (advData) => {
      const log = this.adventureLog.getValue();
      if(advData.timestamp) {
        advData.message = advData.message.split('%timestamp').join(new Date(advData.timestamp).toLocaleString());
      }
      log.unshift(advData);
      this.setAdventureLog(log);
    });

    this.socketService.register(ServerEventName.ItemCompare, ({ newItem, currentItem, choiceId }) => {
      this.itemCompare(newItem, currentItem, choiceId);
    });

    this.socketService.register(ServerEventName.ChatPlayerListSync, (players) => {
      this.allPlayers.push(...players);
      this.sortAndUniqPlayerList();
      this.refreshPlayerInfoHash();
    });

    this.socketService.watch(Channel.PlayerUpdates, ({ player, operation }) => {
      switch(operation) {
        case PlayerChannelOperation.Add: {
          this.allPlayers.push(player);
          this.sortAndUniqPlayerList();
          this.refreshPlayerInfoHash();
          break;
        }

        case PlayerChannelOperation.Update: {
          const retPlayer = merge(find(this.allPlayers, { name: player.name }), player);
          this.playerInfoHash[player.name] = retPlayer;
          break;
        }

        case PlayerChannelOperation.SpecificUpdate: {
          const retPlayer = merge(find(this.allPlayers, { name: player.name }), player);
          this.playerInfoHash[player.name] = retPlayer;
          break;
        }

        case PlayerChannelOperation.Remove: {
          pullAllBy(this.allPlayers, [player], p => p.name === player.name);
          this.sortAndUniqPlayerList();
          this.refreshPlayerInfoHash();
          break;
        }
      }
    });

    this.socketService.watch(Channel.PlayerChat, ({ message }) => {
      this.addMessage(message);
    });
  }

  private addMessage(message: IMessage) {
    this.allMessages.push(message);

    while(this.allMessages.length > 200) this.allMessages.shift();

    this.storage.set('lastMessages', this.allMessages);

    if(!window.location.href.includes('/chat')) {
      this.newMessages++;
    }
  }

  public resetMessages() {
    this.newMessages = 0;
  }

  public logout() {
    this.removePlayerData();
    this.socketService.emit(ServerEventName.AuthSignOut);
  }

  public delete() {
    this.socketService.emit(ServerEventName.AuthDelete);
    this.removePlayerData();
  }

  public async itemCompare(newItem: IItem, currentItem: IItem, choiceId?: string) {
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

    const curEnchantLevel = currentItem && currentItem.enchantLevel ? `+${currentItem.enchantLevel}` : '';
    const top = `
    <table class="item-compare-table">
      <tr>
        <td colspan="3">
          ↓ ${curEnchantLevel} ${currentItem ? currentItem.name : 'nothing'} [${currentItem ? currentItem.score.toLocaleString() : 0}]
        </td>
      </tr>
    </table>
    `;

    const newEnchantLevel = newItem && newItem.enchantLevel ? `+${newItem.enchantLevel}` : '';
    const bottom = `
    <table class="item-compare-table">
      <tr>
        <td colspan="3" class="ion-text-right">
          ${newEnchantLevel} ${newItem ? newItem.name : 'nothing'} [${newItem ? newItem.score.toLocaleString() : 0}] ↑
        </td>
      </tr>
    </table>
    `;

    const finalString = top + '<table class="item-compare-table">' + baseString + '</table>' + bottom;

    const choice: IChoice = find(this.currentPlayer.$choicesData.choices as IChoice[], { id: choiceId });

    const buttons = [];
    if(choice) {
      if(choice.choices.includes('Yes')) {
        buttons.push({ text: 'Equip', handler: () => {
          if(!choiceId) return;

          this.socketService.emit(ServerEventName.ChoiceMake, { choiceId, valueChosen: 'Yes' });
        } });
      }

      if(choice.choices.includes('Inventory')) {
        buttons.push({ text: 'Inventory', handler: () => {
          if(!choiceId) return;

          this.socketService.emit(ServerEventName.ChoiceMake, { choiceId, valueChosen: 'Inventory' });
        } });
      }

      if(choice.choices.includes('Sell')) {
        buttons.push({ text: 'Sell', handler: () => {
          if(!choiceId) return;

          this.socketService.emit(ServerEventName.ChoiceMake, { choiceId, valueChosen: 'Sell' });
        } });
      }
    } else {
      buttons.push({ text: 'Equip', handler: () => {
        this.socketService.emit(ServerEventName.ItemEquip, { itemId: newItem.id });
      } });
    }

    const alert = await this.alertCtrl.create({
      header: `Item Compare (${newItem.type})`,
      cssClass: 'item-compare-modal',
      message: finalString,
      buttons
    });

    alert.present();
  }

  public getPlayerLocationsInCurrentMap() {
    const map = this.currentPlayer.map;
    return this.allPlayers.filter(x => x.map === map);
  }


  private determineRewardName(reward: string) {
    const res = GachaNameReward[reward];
    if(res) return res;

    if(reward.includes('teleportscroll')) {
      return `Teleport Scroll: ${reward.split(':')[2]}`;
    }

    if(reward.includes('collectible:guardian')) {
      return `Collectible (${reward.split(':')[2]})`;
    }

    if(reward.includes('item:guardian')) {
      return `Item (${reward.split(':')[2]})`;
    }

    return 'UNKNOWN REWARD!';
  }

  public async showRewards(title: string, rewards) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: '<ol>' + rewards.map(x => this.determineRewardName(x)).map(x => '<li>' + x + '</li>').join('') + '</ol>',
      buttons: [
        'OK'
      ]
    });

    alert.present();
  }

  public updateOptions() {
    this.http.get(`${this.apiUrl}/settings`)
      .subscribe(settings => {
        this.gameSettings = settings;
      });
  }

  public async toggleNotificationSetting(setting: string) {
    this.notificationSettings[setting] = !this.notificationSettings[setting];

    if(setting === 'enabled' && this.notificationSettings[setting]) {
      const res = await this.requestNotificationPermission();
      if(!res) return;
    }

    this.storage.set('notifications', this.notificationSettings);
  }

  public async requestNotificationPermission() {
    if(!window['Notification']) return false;

    const res = await Notification.requestPermission();
    if (res === 'granted') {
      this.createNotification('Test Notification', 'This is a test notification from IdleLands.');
    }

    return res === 'granted';
  }

  private createNotification(title: string, body?: string, actions?: NotificationAction[]): Notification {
    const notif = new Notification(title, {
      body,
      icon: 'https://play.idle.land/assets/favicon/android-chrome-512x512.png',
      badge: 'https://play.idle.land/assets/favicon/android-chrome-512x512.png',
      actions
    });

    return notif;
  }

  private checkPlayerUpdatesForNotifications(player: IPlayer, nowPlayer: IPlayer) {
    if(!player || !nowPlayer) return;
    if(!window['Notification']) return;
    if(window['Notification'].permission !== 'granted') return;

    if(this.notificationSettings.fullChoiceLog
    && player.$choicesData.choices.length !== player.$choicesData.size
    && nowPlayer.$choicesData.choices.length === nowPlayer.$choicesData.size) {
      this.createNotification(
        'Choice Log Full',
        'Your choice log is full. Decisions will be made automatically if any more choices come up.'
      );
    }

    if(this.notificationSettings.readyToAscend
    && player.level.__current !== player.level.maximum
    && player.level.__current === player.level.maximum) {
      this.createNotification(
        'Ready to Ascend',
        'It\'s time to ascend!'
      );
    }

    if(this.notificationSettings.fullStamina
    && player.stamina.__current !== player.stamina.maximum
    && player.stamina.__current === player.stamina.maximum) {
      this.createNotification(
        'Stamina Full',
        'Your stamina is full. Use it or lose it!'
      );
    }
  }

}
