import { AutoWired, Singleton } from 'typescript-ioc';
import { Signal } from 'signals';

// TODO: player chat
// TODO: parties / buffs, events

export enum Channel {
  PlayerMessage = 'playerMessage',
  EventMessage = 'eventMessage',
  PlayerChat = 'playerChat',
  PlayerBuffs = 'playerBuffs',
  PlayerEvents = 'playerEvents',
  Players = 'players'
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
