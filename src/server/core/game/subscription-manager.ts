import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { Signal } from 'signals';

export enum Channel {
  PlayerMessage = 'playerMessage',
  EventMessage = 'eventMessage'
}

@Singleton
@AutoWired
export class SubscriptionManager {

  private channels: { [key in Channel]?: any } = {};
  private signals:  { [key in Channel]?: any } = {};

  async init(scExchange) {
    Object.keys(Channel).forEach(chan => {
      const channel = scExchange.subscribe(chan);
      this.channels[Channel[chan]] = channel;

      const signal = new Signal();
      this.signals[Channel[chan]] = signal;

      channel.watch(data => signal.dispatch(data));
    });
  }

  public emitToChannel(chan: Channel, data: any) {
    this.channels[chan].publish(data);
  }

  public subscribeToChannel(chan: Channel, cb: Function) {
    this.signals[chan].add(cb);
  }
}
