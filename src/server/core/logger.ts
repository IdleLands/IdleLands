import { Singleton, AutoWired } from 'typescript-ioc';
import * as Rollbar from 'rollbar';

const rollbarToken = process.env.ROLLBAR_ACCESS_TOKEN;

@Singleton
@AutoWired
export class Logger {

  private rollbar;

  public async init() {
    if(rollbarToken) {
      this.rollbar = new Rollbar({
        accessToken: rollbarToken,
        captureUncaught: true,
        captureUnhandledRejections: true
      });
    }
  }

  private timestamp() {
    return new Date();
  }

  log(...args) {
    console.log(this.timestamp(), ...args);
  }

  error(...args) {
    console.error(this.timestamp(), ...args);

    if(this.rollbar) {
      this.rollbar.error(...args);
    }
  }

}
