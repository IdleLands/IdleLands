import { Singleton, AutoWired } from 'typescript-ioc';

import { Player } from '../../../shared/models/entity';

@Singleton
@AutoWired
export class PlayerManager {
  private players: { [key: string]: Player } = {};
  private playerList: Player[] = [];

  public get allPlayers(): Player[] {
    return this.playerList;
  }

  private resetPlayerList() {
    this.playerList = Object.values(this.players);
  }

  public addPlayer(player: Player): void {
    player.loggedIn = true;
    this.players[player.name] = player;
    this.resetPlayerList();
  }

  public removePlayer(player: Player): void {
    delete this.players[player.name];
    this.resetPlayerList();
  }

  public getPlayer(name: string): Player {
    return this.players[name];
  }

}
