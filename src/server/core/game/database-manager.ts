
import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { Connection, createConnection, getConnectionOptions, MongoEntityManager, getMongoManager } from 'typeorm';
import { extend } from 'lodash';

import * as firebaseAdmin from 'firebase-admin';

import { Player, Assets, GameSettings } from '../../../shared/models';
import { Logger } from '../logger';
import { SHARED_FIELDS } from './shared-fields';
import { Festivals } from '../../../shared/models/entity/Festivals.entity';

const firebaseKey = process.env.FIREBASE_ADMIN_JSON;
const firebaseProj = process.env.FIREBASE_ADMIN_DATABASE;

@Singleton
export class DatabaseManager {
  private connection: Connection;
  private manager: MongoEntityManager;

  @Inject public logger: Logger;

  private firebase;

  public async init() {
    if(firebaseKey && firebaseProj) {
      this.firebase = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(JSON.parse(firebaseKey)),
        databaseURL: firebaseProj
      });
    }

    const opts = await getConnectionOptions();
    (<any>opts).useNewUrlParser = true;
    this.connection = await createConnection(opts);
    this.manager = getMongoManager();

    this.updateOldData();
  }

  private async updateOldData() {
    await this.manager.updateMany(Player, {}, { $set: { loggedIn: false } });
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

  // PLAYER FUNCTIONS
  public async createPlayer(game, name, userId): Promise<Player> {
    if(!this.connection) return null;

    const player = new Player();
    extend(player, { name, userId, currentUserId: userId, $game: game });
    player.init();

    try {
      await this.savePlayer(player);
      return player;

    } catch(e) {
      this.logger.error(`DatabaseManager#createPlayer`);
    }
  }

  public async loadPlayer(game, query): Promise<Player> {
    if(!this.connection) return null;

    try {
      const player = await this.connection.manager.findOne(Player, query);

      const allUpdatedFields = await Promise.all(
        SHARED_FIELDS.map(x => this.connection.manager.findOne(x.proto, { owner: player.name }))
      );

      allUpdatedFields.forEach((data, i) => {
        const matchingKey = SHARED_FIELDS[i].name;
        player[`$${matchingKey}`] = data;
      });

      (<any>player).$game = game;
      player.init();
      return player;

    } catch(e) {
      this.logger.error(`DatabaseManager#loadPlayer`, e);
    }
  }

  public async findPlayerWithDiscordTag(discordTag: string): Promise<Player> {
    if(!this.connection) return null;
    return this.connection.manager.findOne(Player, { discordTag });
  }

  public async savePlayer(player: Player): Promise<void> {
    if(!this.connection) return null;

    try {
      await Promise.all(
        SHARED_FIELDS.map(x => this.connection.manager.save(x.proto, player[`$${x.name}`].toSaveObject()))
      );

      const saveObj = player.toSaveObject();
      saveObj._id = player._id;
      await this.connection.manager.save(Player, saveObj);

    } catch(e) {
      this.logger.error(`DatabaseManager#savePlayer`, e);
    }
  }

  public async deletePlayer(player: Player): Promise<void> {
    if(!this.connection) return null;

    try {
      await Promise.all([
        SHARED_FIELDS.map(x => this.connection.manager.remove(x.proto, player[`$${x.name}`]))
      ]);

      const saveObj = player.toSaveObject();
      saveObj._id = player._id;
      await this.connection.manager.remove(Player, saveObj);

    } catch(e) {
      this.logger.error(`DatabaseManager#removePlayer`, e);
    }
  }

  public async verifyToken(token: string) {
    return this.firebase.auth().verifyIdToken(token);
  }

  public async setAuthKey(player: Player, token: string, removeToken = false): Promise<boolean|string> {
    if(!this.connection) return null;
    if(!this.firebase) throw new Error('No firebase admin connection!');

    if(removeToken) {
      player.authType = null;
      player.authId = null;
      player.authSyncedTo = null;

      this.savePlayer(player);

      return true;
    }

    const decoded = await this.verifyToken(token);
    const provider = decoded.firebase.sign_in_provider;
    const uid = decoded.uid;

    if(player.authId === uid) return false;

    const existingAuthPlayer = await this.connection.manager.findOne(Player, { authId: uid });
    if(existingAuthPlayer && existingAuthPlayer.name !== player.name) return 'Account already synced to another player.';

    player.authType = provider;
    player.authId = uid;
    player.authSyncedTo = decoded.name || decoded.email || 'unknown';

    this.savePlayer(player);

    return true;
  }

  // ASSET FUNCTIONS
  public async loadAssets(): Promise<Assets> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.findOne(Assets);

    } catch(e) {
      this.logger.error(`DatabaseManager#loadAssets`, e);
    }
  }

  // FESTIVAL FUNCTIONS
  public async loadFestivals(): Promise<Festivals> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.findOne(Festivals);

    } catch(e) {
      this.logger.error(`DatabaseManager#loadFestivals`, e);
    }
  }

  public async saveFestivals(festivals: Festivals): Promise<Festivals> {
    if(!this.connection) return null;

    try {
      return await this.connection.manager.save(Festivals, festivals);

    } catch(e) {
      this.logger.error(`DatabaseManager#saveFestivals`, e);
    }
  }

  // SETTINGS FUNCTIONS
  public async loadSettings(): Promise<GameSettings> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.findOne(GameSettings);

    } catch(e) {
      this.logger.error(`DatabaseManager#loadSettings`, e);
    }
  }

  public async saveSettings(settings: GameSettings): Promise<GameSettings> {
    if(!this.connection) return null;

    try {
      return await this.connection.manager.save(GameSettings, settings);

    } catch(e) {
      this.logger.error(`DatabaseManager#saveSettings`, e);
    }
  }

}
