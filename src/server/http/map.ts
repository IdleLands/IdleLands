import { ServerAPICall } from '../../shared/models/ServerAPICall';
import { Game } from '../core/game/game';

export class MapAPICall extends ServerAPICall {

  static desc = 'Get map data for a given map';
  static params = 'map';

  static init(app, game: Game) {
    app.get('/map', async (req, res) => {
      try {
        const { jsonMap } = await game.world.getMap(req.query.map);
        res.json(jsonMap);
      } catch(e) {
        res.json({ });
      }
    });
  }
}
