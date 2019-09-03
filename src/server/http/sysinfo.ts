import { ServerAPICall } from '../../shared/models/ServerAPICall';
import { Game } from '../core/game/game';

import * as system from 'systeminformation';

export class SysInfoAPICall extends ServerAPICall {

  static desc = 'Get system info for currently-running server.';
  static params = 'map';

  static init(app, game: Game) {
    app.get('/sysinfo', async (req, res) => {

      let load = null;
      let diskio = null;
      let netio = null;
      let cpu = null;
      let ram = null;

      try {
        load = await system.currentLoad();
      } catch(e) { }

      try {
        diskio = await system.disksIO();
      } catch(e) { }

      try {
        netio = await system.networkStats('*');
      } catch(e) { }

      try {
        cpu = await system.cpuCurrentspeed();
      } catch(e) { }

      try {
        ram = await system.mem();
      } catch(e) { }


      res.json({
        load,
        diskio,
        netio,
        cpu,
        ram
      });
    });
  }
}
