import { ServerAPICall } from '../../shared/models/ServerAPICall';
import { Game } from '../core/game/game';

export class PlayerAPICall extends ServerAPICall {

  static desc = 'Get players from a certain map.';
  static params = 'map';

  static init(app, game: Game) {
    app.get('/players', async (req, res) => {
      res.json(await game.databaseManager.getAllPlayerLocations(req.query.map));
    });
  }
}
