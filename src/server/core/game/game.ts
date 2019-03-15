import { Singleton, Inject } from 'typescript-ioc';
import { DatabaseManager } from './database-manager';
import { PlayerManager } from './player-manager';

import { Player } from '../../../shared/models/entity';
import { ServerEventName, IGame } from '../../../shared/interfaces';
import { Logger } from '../logger';
import { ItemGenerator } from './item-generator';
import { AssetManager } from './asset-manager';

const GAME_DELAY = process.env.GAME_DELAY ? +process.env.GAME_DELAY : 5000;
const SAVE_TICKS = process.env.NODE_ENV === 'production' ? 60 : 5;

@Singleton
export class Game implements IGame {

  @Inject public databaseManager: DatabaseManager;
  @Inject public assetManager: AssetManager;
  @Inject public playerManager: PlayerManager;
  @Inject public itemGenerator: ItemGenerator;
  @Inject public logger: Logger;

  private ticks = 0;

  public async init() {
    await this.databaseManager.init();
    await this.assetManager.init();
    await this.itemGenerator.init();
    this.loop();
  }

  public loop() {

    this.ticks++;

    // intentionally, we don't wait for each player to save (we could do for..of)
    // we just want to make sure their player event is done before we send an update
    this.playerManager.allPlayers.forEach(async player => {
      await player.loop();

      this.updatePlayer(player);

      if((this.ticks % SAVE_TICKS) === 0) {
        this.logger.log(`Game`, `Saving player ${player.name}...`);
        this.databaseManager.savePlayer(player);
      }
    });

    if(this.ticks > 600) this.ticks = 0;

    setTimeout(() => {
      this.loop();
    }, GAME_DELAY);
  }

  public updatePlayer(player: Player) {
    const socket = this.playerManager.getPlayerSocket(player.name);
    const patch = this.playerManager.getPlayerPatch(player.name);

    socket.emit(ServerEventName.CharacterPatch, patch);
  }
}
