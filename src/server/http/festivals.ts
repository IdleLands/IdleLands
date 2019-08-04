import { ServerAPICall } from '../../shared/models/ServerAPICall';
import { Game } from '../core/game/game';

export class FestivalsAPICall extends ServerAPICall {

  static desc = 'Get the current festivals running in game';
  static params = '';

  static init(app, game: Game) {
    app.get('/festivals', async (req, res) => {
      let festivals = [];

      try {
        festivals = (await game.databaseManager.loadFestivals()).festivals;
      } catch(e) {}

      res.json({ festivals });
    });
  }
}
