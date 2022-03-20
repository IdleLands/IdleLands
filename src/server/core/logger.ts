import { Singleton, AutoWired } from 'typescript-ioc';
import * as Rollbar from 'rollbar';

import * as Winston from 'winston';
import 'winston-syslog';

const rollbarToken = process.env.ROLLBAR_ACCESS_TOKEN;

@Singleton
@AutoWired
export class Logger {

  private rollbar;
  private winston;

  public async init() {
    if(rollbarToken) {
      this.rollbar = new Rollbar({
        accessToken: rollbarToken,
        captureUncaught: true,
        captureUnhandledRejections: true
      });
    }
    if (process.env.PAPERTRAIL_HOST && process.env.PAPERTRAIL_PORT) {
      const papertrail = new (Winston.transports as any).Syslog({
        host: process.env.PAPERTRAIL_HOST,
        port: +process.env.PAPERTRAIL_PORT,
        protocol: 'tls4',
        localhost: require('os').hostname(),
        eol: '\n',
      });

      this.winston = Winston.createLogger({
        format: Winston.format.simple(),
        levels: Winston.config.syslog.levels,
        transports: [papertrail]
      });
    }
  }

  private timestamp() {
    return new Date();
  }

  private _papertrailLog(type: 'info'|'warn'|'error', tag, ...args) {
    this.winston?.[type]?.(`[${tag}] ${args}`);
  }

  log(...args) {
    console.log(this.timestamp(), ...args);
    this._papertrailLog('info', this.timestamp(), ...args);
  }

  error(...args) {
    console.error(this.timestamp(), ...args);
    this._papertrailLog('error', this.timestamp(), ...args);

    if(this.rollbar) {
      this.rollbar.error(...args);
    }
  }

}
