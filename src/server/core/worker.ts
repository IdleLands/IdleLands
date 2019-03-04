const SCWorker = require('socketcluster/scworker');
const express = require('express');
const morgan = require('morgan');
const healthChecker = require('sc-framework-health-check');

const allEvents = require('../modules');

export class GameWorker extends SCWorker {
  run() {
    console.log('   >> Worker PID:', process.pid);
    const environment = this.options.environment;

    const app = express();

    const httpServer = this.httpServer;
    const scServer = this.scServer;

    if (environment === 'dev') {
      // Log every HTTP request. See https://github.com/expressjs/morgan for other
      // available formats.
      app.use(morgan('dev'));
    }

    // Add GET /health-check express route
    healthChecker.attach(this, app);

    httpServer.on('request', app);

    // initialize all the socket commands for the newly connected client
    scServer.on('connection', (socket) => {
      Object.values(allEvents).forEach((EvtCtor: any) => {
        const evtInst = new EvtCtor(socket);
        socket.on(evtInst.event, () => evtInst.callback(socket));
      });
    });
  }
}

const gameWorker = new GameWorker();
