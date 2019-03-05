
import { Singleton, AutoWired } from 'typescript-ioc';
import { Connection, createConnection } from 'typeorm';
import { extend } from 'lodash';

import { Player } from '../../../shared/models/entity/Player';

@Singleton
@AutoWired
export class DatabaseManager {
  private connection: Connection;

  public async init() {
    this.connection = await createConnection();
  }

  public async loadPlayer(query): Promise<Player> {
    return this.connection.manager.findOne(Player, query);
  }

  public async savePlayer(query): Promise<void> {
    return this.connection.manager.save(Player, query);
  }

  public async createPlayer(name, userId): Promise<Player> {
    const player = new Player();
    extend(player, { name, userId });
    await this.connection.manager.save(player);
    return player;
  }
}
