
import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { Connection, createConnection, getConnectionOptions } from 'typeorm';
import { extend } from 'lodash';

import * as firebaseAdmin from 'firebase-admin';

import { Player, Assets } from '../../../shared/models';
import { Logger } from '../logger';
import { SHARED_FIELDS } from './shared-fields';

const firebaseKey = process.env.FIREBASE_ADMIN_JSON;
const firebaseProj = process.env.FIREBASE_ADMIN_DATABASE;

@Singleton
@AutoWired
export class DatabaseManager {
  private connection: Connection;

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

    console.log(res)

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

  public async setAuthKey(player: Player, token: string, removeToken = false): Promise<boolean> {
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

}
