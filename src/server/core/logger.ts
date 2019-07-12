import { Singleton, AutoWired } from 'typescript-ioc';

@Singleton
@AutoWired
export class Logger {

  public async init() {

  }

  private timestamp() {
    return new Date();
  }

  log(...args) {
    console.log(this.timestamp(), ...args);
  }

  error(...args) {
    console.error(this.timestamp(), ...args);
  }

}
