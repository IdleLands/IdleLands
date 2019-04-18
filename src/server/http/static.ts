
import * as express from 'express';
import * as path from 'path';

import { ServerAPICall } from '../../shared/models/ServerAPICall';
import { Game } from '../core/game/game';

export class StaticAPICall extends ServerAPICall {

  static desc = 'Static file serving.';
  static params = '';

  static init(app, game: Game) {
    app.use('/static', express.static(path.join(__dirname, '../../../assets/maps/img')));
  }
}
