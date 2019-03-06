
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

    this.updateOldData();
  }

  private updateOldData() {
    this.connection.manager.update(Player, {}, { loggedIn: false });
  }

  // external API calls
  public async getAllPlayerLocations(map: string): Promise<Player[]> {
    if(!this.connection) return [];

    const res = await this.connection.manager.find(Player, {
      where: { loggedIn: true, map },
      select: ['name', 'gender', 'x', 'y'] }
    );

    res.forEach((p: any) => delete p.id);

    return res;
  }

  // internal API calls
  public async checkIfPlayerExists(query): Promise<Player> {
    if(!this.connection) return null;

    const player = await this.connection.manager.findOne(Player, query);
    return player;
  }

  public async loadPlayer(query): Promise<Player> {
    if(!this.connection) return null;

    const player = await this.connection.manager.findOne(Player, query);
    player.init();
    return player;
  }

  public async savePlayer(query): Promise<void> {
    if(!this.connection) return null;

    return this.connection.manager.save(Player, query);
  }

  public async createPlayer(name, userId): Promise<Player> {
    if(!this.connection) return null;

    const player = new Player();
    extend(player, { name, userId });
    player.init();
    await this.connection.manager.save(player);
    return player;
  }
}
