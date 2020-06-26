import { ServerAPICall } from '../../shared/models/ServerAPICall';
import { Game } from '../core/game/game';

export class SettingsAPICall extends ServerAPICall {

  static desc = 'Get the current game settings for the game';
  static params = '';

  static init(app, game: Game) {
    app.get('/settings', async (req, res) => {
      const settings = (game.gmHelper as any).settings;

      res.json(settings);
    });
  }
}
