import { Singleton, AutoWired } from 'typescript-ioc';

import { IPlayer } from '../../../shared/interfaces/IPlayer';

@Singleton
@AutoWired
export class PlayerManager {
  private players: { [key: string]: IPlayer } = {};
  private playerList: IPlayer[] = [];

  public get allPlayers(): IPlayer[] {
    return this.playerList;
  }

  private resetPlayerList() {
    this.playerList = Object.values(this.players);
  }

  public addPlayer(player: IPlayer): void {
    player.loggedIn = true;
    this.players[player.name] = player;
    this.resetPlayerList();
  }

  public removePlayer(player: IPlayer): void {
    delete this.players[player.name];
    this.resetPlayerList();
  }

  public getPlayer(name: string): IPlayer {
    return this.players[name];
  }

}
