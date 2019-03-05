import { Singleton, Inject } from 'typescript-ioc';
import { DatabaseManager } from './database-manager';
import { PlayerManager } from './player-manager';

const GAME_DELAY = process.env.GAME_DELAY ? +process.env.GAME_DELAY : 5000;

@Singleton
export class Game {

  @Inject public databaseManager: DatabaseManager;
  @Inject public playerManager: PlayerManager;

  private ticks = 0;

  public init() {
    this.databaseManager.init();
    this.loop();
  }

  public loop() {

    this.ticks++;

    this.playerManager.allPlayers.forEach(player => {
      player.loop();

      if((this.ticks % 60) === 0) this.databaseManager.savePlayer(player);
    });

    setTimeout(() => {
      this.loop();
    }, GAME_DELAY);
  }
}
