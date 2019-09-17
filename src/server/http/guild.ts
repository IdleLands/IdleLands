import { ServerAPICall } from '../../shared/models/ServerAPICall';
import { Game } from '../core/game/game';

export class GuildsAPICall extends ServerAPICall {

  static desc = 'Get the guilds that exist in the game';
  static params = '';

  static init(app, game: Game) {
    app.get('/guilds/all', async (req, res) => {
      let guilds = [];

      try {
        guilds = (await game.databaseManager.loadBriefGuilds());
      } catch(e) { }

      res.json({ guilds });
    });
  }
}

export class GuildAPICall extends ServerAPICall {

  static desc = 'Get a guild by name';
  static params = 'name';

  static init(app, game: Game) {
    app.get('/guilds/name', async (req, res) => {
      let guild = { };

      try {
        guild = (await game.databaseManager.loadGuild(req.query.name));
      } catch(e) { }

      res.json({ guild });
    });
  }
}

export class GuildInvitesAndApplicationsAPICall extends ServerAPICall {

  static desc = 'Get the guild invites/applications for a particular player or guild';
  static params = 'playerName?, guildName?';

  static init(app, game: Game) {
    app.get('/guilds/appinv', async (req, res) => {
      let appinvs = [];

      try {
        if(req.query.playerName) {
          appinvs = (await game.databaseManager.loadAppsInvitesForPlayer(req.query.playerName));
        }

        if(req.query.guildName) {
          appinvs = (await game.databaseManager.loadAppsInvitesForGuild(req.query.guildName));
        }
      } catch(e) { }

      res.json({ appinvs });
    });
  }
}

export class GuildRaidAPICall extends ServerAPICall {

  static desc = 'Get the current raid bosses';
  static params = 'maxLevel';

  static init(app, game: Game) {
    app.get('/guilds/raids', async (req, res) => {
      res.json({ raids: game.guildManager.raidBosses(+req.query.maxLevel) });
    });
  }
}
