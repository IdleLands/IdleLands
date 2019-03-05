import { Player } from '../../../shared/models/entity/Player';
import { Singleton } from 'typescript-ioc';

@Singleton
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
