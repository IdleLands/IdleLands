import { ServerAPICall } from '../../shared/models/ServerAPICall';
import { Game } from '../core/game/game';

export class GlobalQuestsAPICall extends ServerAPICall {

  static desc = 'Get the current global quests running in game';
  static params = '';

  static init(app, game: Game) {
    app.get('/globalquests', async (req, res) => {
      let globalQuests = [];

      try {
        globalQuests = (await game.databaseManager.loadGlobalQuests()).globalQuests;
      } catch(e) {}

      res.json({ globalQuests });
    });
  }
}
