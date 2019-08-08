import { ServerAPICall } from '../../shared/models/ServerAPICall';
import { Game } from '../core/game/game';

export class SettingsAPICall extends ServerAPICall {

  static desc = 'Get the current game settings for the game';
  static params = '';

  static init(app, game: Game) {
    app.get('/settings', async (req, res) => {
      let settings = {};

      try {
        settings = (await game.databaseManager.loadSettings());
        delete (settings as any)._id;
      } catch(e) {}

      res.json(settings);
    });
  }
}
