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

  static desc = 'Get the guild invites/applications for a particular player';
  static params = 'playerName';

  static init(app, game: Game) {
    app.get('/guilds/appinv', async (req, res) => {
      let appinvs = [];

      try {
        appinvs = (await game.databaseManager.loadAppsInvitesForPlayer(req.query.playerName));
      } catch(e) { }

      res.json({ appinvs });
    });
  }
}
