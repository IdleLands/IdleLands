
const SCWorker = require('socketcluster/scworker');
const express = require('express');
const morgan = require('morgan');
const healthChecker = require('sc-framework-health-check');

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

    let count = 0;

    /*
      In here we handle our incoming realtime connections and listen for events.
    */
    scServer.on('connection', (socket) => {

      // Some sample logic to show how to handle client events,
      // replace this with your own logic

      socket.on('sampleClientEvent', (data) => {
        count++;
        console.log('Handled sampleClientEvent', data);
        scServer.exchange.publish('sample', count);
      });

      const interval = setInterval(() => {
        socket.emit('random', {
          number: Math.floor(Math.random() * 5)
        });
      }, 1000);

      socket.on('disconnect', () => {
        clearInterval(interval);
      });
    });
  }
}

const gameWorker = new GameWorker();
