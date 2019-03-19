import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { observe, generate, Observer, Operation } from 'fast-json-patch';

import { Player } from '../../../shared/models/entity';
import { ServerEventName } from '../../../shared/interfaces';
import { SubscriptionManager, Channel } from './subscription-manager';

@Singleton
@AutoWired
export class PlayerManager {
  @Inject private subscriptionManager: SubscriptionManager;

  private players: { [key: string]: Player } = {};
  private playerList: Player[] = [];

  private playerWatches: { [key: string]: Observer<Player> } = {};
  private playerSockets: { [key: string]: any } = {};

  public playerDataHold = {};

  public async init() {
    this.subscribeToPlayerMessages();
  }

  private subscribeToPlayerMessages() {
    this.subscriptionManager.subscribeToChannel(Channel.EventMessage, ({ playerNames, data }) => {

      playerNames.forEach(playerName => {
        this.emitToPlayer(playerName, ServerEventName.AdventureLogAdd, { ...data });
      });
    });
  }

  public get allPlayers(): Player[] {
    return this.playerList;
  }

  private resetPlayerList() {
    this.playerList = Object.values(this.players);
  }

  public addPlayer(player: Player, socket): void {
    player.loggedIn = true;

    this.playerWatches[player.name] = observe(player);

    this.players[player.name] = player;
    this.playerSockets[player.name] = socket;
    this.playerDataHold[player.name] = {};
    this.resetPlayerList();
  }

  public removePlayer(player: Player): void {
    if(this.playerWatches[player.name]) {
      this.playerWatches[player.name].unobserve();
    }

    delete this.players[player.name];
    delete this.playerWatches[player.name];
    delete this.playerDataHold[player.name];
    this.resetPlayerList();
  }

  public getPlayer(name: string): Player {
    return this.players[name];
  }

  public getPlayerPatch(name: string): Operation[] {
    return generate(this.playerWatches[name]);
  }

  public getPlayerSocket(name: string) {
    return this.playerSockets[name];
  }

  public emitToPlayer(playerName: string, event: ServerEventName, data: any): void {
    const socket = this.getPlayerSocket(playerName);
    if(!socket) return;

    socket.emit(event, data);
  }

}
