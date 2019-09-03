import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { Signal } from 'signals';

import { Channel } from '../../../shared/interfaces';
import { Logger } from '../logger';

@Singleton
@AutoWired
export class SubscriptionManager {

  @Inject private logger: Logger;

  private channels: { [key in Channel]?: any } = { };
  private signals:  { [key in Channel]?: any } = { };

  private scServer: any;

  async init(scServer) {
    if(!scServer) {
      this.logger.error('SubscriptionManager', 'No scServer specified; cannot function normally.');
      return;
    }

    this.scServer = scServer;

    Object.keys(Channel).forEach(chan => {
      const channel = scServer.exchange.subscribe(chan);
      this.channels[Channel[chan]] = channel;

      const signal = new Signal();
      this.signals[Channel[chan]] = signal;

      channel.watch(data => signal.dispatch(data));
    });
  }

  public emitToChannel(chan: Channel, data: any) {
    if(!this.scServer) return;
    this.channels[chan].publish(data);
  }

  public emitToClients(chan: Channel, data: any) {
    if(!this.scServer) return;
    this.scServer.exchange.publish(chan, data);
  }

  public subscribeToChannel(chan: Channel, cb: Function) {
    if(!this.scServer) return;
    this.signals[chan].add(cb);
  }
}
