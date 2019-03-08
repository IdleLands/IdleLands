
import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { Connection, createConnection, getConnectionOptions, ObjectID } from 'typeorm';
import { extend } from 'lodash';

import { Player, Statistics } from '../../../shared/models/entity';
import { Logger } from '../logger';

@Singleton
@AutoWired
export class DatabaseManager {
  private connection: Connection;

  @Inject public logger: Logger;

  public async init() {
    const opts = await getConnectionOptions();
    (<any>opts).useNewUrlParser = true;
    this.connection = await createConnection(opts);

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

    try {
      const player = await this.connection.manager.findOne(Player, query);
      return player;

    } catch(e) {
      this.logger.error(`DatabaseManager#checkIfPlayerExists`, e);
    }
  }

  public async createPlayer(name, userId): Promise<Player> {
    if(!this.connection) return null;

    const player = new Player();
    extend(player, { name, userId });
    player.init();

    try {
      await this.savePlayer(player);
      return player;

    } catch(e) {
      this.logger.error(`DatabaseManager#createPlayer`);
    }
  }

  public async loadPlayer(query): Promise<Player> {
    if(!this.connection) return null;

    try {
      const player = await this.connection.manager.findOne(Player, query);

      const [statistics] = await Promise.all([
        this.connection.manager.findOne(Statistics, { owner: player.name })
      ]);

      player.$statistics = statistics;

      player.init();
      return player;

    } catch(e) {
      this.logger.error(`DatabaseManager#load`, e);
    }
  }

  public async savePlayer(player: Player): Promise<void> {
    if(!this.connection) return null;

    try {
      await Promise.all([
        this.connection.manager.save(Statistics, player.$statistics)
      ]);

      await this.connection.manager.save(Player, player.toSaveObject());

    } catch(e) {
      this.logger.error(`DatabaseManager#savePlayer`, e);
    }
  }
}
