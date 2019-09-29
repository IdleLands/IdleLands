
import { Singleton, Inject } from 'typescript-ioc';
import { Connection, createConnection, getConnectionOptions, MongoEntityManager, getMongoManager } from 'typeorm';
import { extend, pick } from 'lodash';
import { decompress } from 'lzutf8';

import * as firebaseAdmin from 'firebase-admin';

import { Player, Assets, GameSettings, GlobalQuests, Guild, GuildInvite } from '../../../shared/models';
import { Logger } from '../logger';
import { SHARED_FIELDS } from './shared-fields';
import { Festivals } from '../../../shared/models/entity/Festivals.entity';
import { IGuildApplication } from '../../../shared/interfaces';

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
        credential: firebaseAdmin.credential.cert(JSON.parse(decompress(firebaseKey, { inputEncoding: 'Base64' }))),
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
    await this.manager.updateMany(Player, { }, { $set: { loggedIn: false } });
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

  public async findPlayerWithIL3Name(il3CharName: string): Promise<Player> {
    if(!this.connection) return null;
    return this.connection.manager.findOne(Player, { il3CharName });
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

  public async renamePlayer(playerName: string, newName: string): Promise<any> {
    await Promise.all([
      SHARED_FIELDS.map(x => this.manager.updateOne(x.proto, { owner: playerName }, { $set: { owner: newName } } ))
    ]);

    return this.manager.updateOne(Player, { name: playerName }, { $set: { name: newName } });
  }

  public async movePlayerToNewId(playerName: string, newPlayerName: string): Promise<boolean> {
    const curId1 = await this.manager.findOne(Player, { name: playerName });
    const curId2 = await this.manager.findOne(Player, { name: newPlayerName });

    if(!curId1 || !curId2) return false;

    await this.manager.updateOne(Player, { name: playerName }, { $set: { currentUserId: curId2.currentUserId } });
    await this.manager.updateOne(Player, { name: newPlayerName }, { $set: { currentUserId: curId1.currentUserId } });

    return true;
  }

  public async verifyToken(token: string) {
    return this.firebase.auth().verifyIdToken(token);
  }

  public async setAuthKey(player: Player, token: string, removeToken = false): Promise<boolean|string> {
    if(!this.connection) return null;
    if(!this.firebase) throw new Error('No firebase admin connection!');

    if(removeToken && player.authId) {
      this.firebase.auth().deleteUser(player.authId);

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

  // GLOBAL QUEST FUNCTIONS
  public async loadGlobalQuests(): Promise<GlobalQuests> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.findOne(GlobalQuests);

    } catch(e) {
      this.logger.error(`DatabaseManager#loadGlobalQuests`, e);
    }
  }

  public async saveGlobalQuests(globalQuests: GlobalQuests): Promise<GlobalQuests> {
    if(!this.connection) return null;

    try {
      return await this.connection.manager.save(GlobalQuests, globalQuests);

    } catch(e) {
      this.logger.error(`DatabaseManager#saveGlobalQuests`, e);
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

  // GUILD FUNCTIONS
  public async loadBriefGuilds(): Promise<any[]> {
    if(!this.connection) return null;

    try {
      const guilds = await this.connection.manager.find(Guild);
      return guilds
              .filter(g => g.recruitment !== 'Closed')
              .map(guild => pick(guild, ['buildingLevels', 'name', 'tag', 'recruitment']));

    } catch(e) {
      this.logger.error(`DatabaseManager#loadBriefGuilds`, e);
    }
  }

  public async clearAppsInvitesForPlayer(playerName: string, guildName?: string): Promise<any> {
    if(!this.connection) return null;

    const opts: any = { playerName };
    if(guildName) opts.guildName = guildName;

    try {
      return this.connection.getMongoRepository(GuildInvite).deleteMany(opts);

    } catch(e) {
      this.logger.error(`DatabaseManager#clearAppsInvitesForPlayer`, e);
    }
  }

  public forcePlayerToJoinGuild(playerName: string, guildName: string): Promise<any> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.getMongoRepository(Player).findOneAndUpdate({ name: playerName }, { $set: { guildName } });

    } catch(e) {
      this.logger.error(`DatabaseManager#forcePlayerToJoinGuild`, e);
    }
  }

  public async loadAppsInvitesForPlayer(playerName: string): Promise<GuildInvite[]> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.find(GuildInvite, { playerName });

    } catch(e) {
      this.logger.error(`DatabaseManager#loadAppsInvitesForPlayer`, e);
    }
  }

  public async loadAppsInvitesForGuild(guildName: string): Promise<GuildInvite[]> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.find(GuildInvite, { guildName });

    } catch(e) {
      this.logger.error(`DatabaseManager#loadAppsInvitesForGuild`, e);
    }
  }

  public async applyInviteToGuild(playerName: string, guildName: string, type: 'invite'|'application'): Promise<any> {
    if(!this.connection) return null;

    const existing = await this.connection.manager.findOne(GuildInvite, { playerName, guildName, type });
    if(existing) throw new Error('Already have an invite/application for this player/guild');

    try {
      return this.connection.manager.insert(GuildInvite, { playerName, guildName, type });

    } catch(e) {
      this.logger.error(`DatabaseManager#applyInviteToGuild`, e);
    }
  }

  public async loadGuilds(): Promise<Guild[]> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.find(Guild);

    } catch(e) {
      this.logger.error(`DatabaseManager#loadGuilds`, e);
    }
  }

  public async loadGuild(name: string): Promise<Guild> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.findOne(Guild, { name });

    } catch(e) {
      this.logger.error(`DatabaseManager#loadGuild`, e);
    }
  }

  public async saveGuild(guild: Guild): Promise<Guild> {
    if(!this.connection || !guild) return null;

    try {
      return await this.connection.manager.save(Guild, guild);

    } catch(e) {
      this.logger.error(`DatabaseManager#saveGuild`, e);
    }
  }

  public async loadGuildInvitesForPlayer(playerName: string): Promise<IGuildApplication[]> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.find(GuildInvite, { playerName });

    } catch(e) {
      this.logger.error(`DatabaseManager#loadGuildInvitesForPlayer`, e);
    }
  }

  public async loadGuildInvitesForGuildName(guildName: string): Promise<IGuildApplication[]> {
    if(!this.connection) return null;

    try {
      return this.connection.manager.find(GuildInvite, { guildName });

    } catch(e) {
      this.logger.error(`DatabaseManager#loadGuildInvitesForGuildName`, e);
    }
  }

}
