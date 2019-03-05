
import { Singleton, AutoWired } from 'typescript-ioc';
import { Connection, createConnection } from 'typeorm';
import { Player } from '../../../shared/models/entity/Player';

@Singleton
@AutoWired
export class DatabaseManager {
  private connection: Connection;

  public async init() {
    this.connection = await createConnection();
  }

  public async loadPlayer(query) {
    return this.connection.manager.findOne(Player, query);
  }

  public async savePlayer(query) {
    return this.connection.manager.save(Player, query);
  }
}
