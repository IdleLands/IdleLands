import { Game } from './game/game';

const SCWorker = require('socketcluster/scworker');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const healthChecker = require('sc-framework-health-check');
const scCodecMinBin = require('sc-codec-min-bin');

const allEvents = require('../modules');
const allAPI = require('../http');

const GRACE_PERIOD_DISCONNECT = process.env.GRACE_PERIOD_DISCONNECT ? +process.env.GRACE_PERIOD_DISCONNECT : 30000;

export class GameWorker extends SCWorker {
  async run() {
    console.log('   >> Worker PID:', process.pid, 'ID:', this.id);

    const httpServer = this.httpServer;
    const scServer = this.scServer;

    // scServer.setCodecEngine(scCodecMinBin);

    const game = new Game();
    await game.init(scServer, this.id);

    const environment = this.options.environment;
    const app = express();

    app.use(compression());

    if(environment === 'dev') {
      app.use(morgan('dev'));
      app.use(cors());
    } else {
      app.use(cors({
        origin: 'https://play.idle.land'
      }));
    }

    // Add GET /health-check express route
    healthChecker.attach(this, app);

    const limiter = rateLimit({
      windowMs: 10 * 1000, // 10 seconds
      max: 10
    });

    if(process.env.NODE_ENV === 'production') {
      app.use('/api/', limiter);
    }

    const api = express();

    Object.values(allAPI).forEach((API: any) => {
      API.init(api, game);
    });

    app.use('/api', api);

    httpServer.on('request', app);

    // initialize all the socket commands for the newly connected client
    scServer.on('connection', (socket) => {

      socket.on('error', err => {
        console.error('Socket', err);
      });

      Object.values(allEvents).forEach((EvtCtor: any) => {
        const evtInst = new EvtCtor(game, socket);
        socket.on(evtInst.event, async (args) => {
          if(evtInst.isDoingSomething) return;

          evtInst.isDoingSomething = true;
          await evtInst.callback(args || { });
          evtInst.isDoingSomething = false;
        });
      });
    });

    // handle disconnecting the client from the player
    // if they do not come back within GRACE_PERIOD_DISCONNECT, we remove their player from the game, too
    scServer.on('disconnection', (socket) => {
      if(!socket.playerName) return;

      const player = game.playerManager.getPlayer(socket.playerName);
      if(!player) return;

      player.loggedIn = false;

      setTimeout(() => {
        const checkAgainPlayer = game.playerManager.getPlayer(socket.playerName);
        if(!checkAgainPlayer || checkAgainPlayer && checkAgainPlayer.loggedIn) return;
        game.playerManager.removePlayer(checkAgainPlayer);
        game.databaseManager.savePlayer(checkAgainPlayer);
      }, GRACE_PERIOD_DISCONNECT);
    });

    scServer.on('error', (err) => {
      console.error('SCWorker', err);
    });
  }
}

const gameWorker = new GameWorker();

gameWorker.on('error', err => {
  console.error('SCWorker GameWorker', err);
});
