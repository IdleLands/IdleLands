import { AutoWired, Singleton } from 'typescript-ioc';
import { Signal } from 'signals';

import { Channel } from '../../../shared/interfaces';

@Singleton
@AutoWired
export class SubscriptionManager {

  private channels: { [key in Channel]?: any } = { };
  private signals:  { [key in Channel]?: any } = { };

  private scServer: any;

  async init(scServer) {
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
    this.channels[chan].publish(data);
  }

  public emitToClients(chan: Channel, data: any) {
    this.scServer.exchange.publish(chan, data);
  }

  public subscribeToChannel(chan: Channel, cb: Function) {
    this.signals[chan].add(cb);
  }
}
