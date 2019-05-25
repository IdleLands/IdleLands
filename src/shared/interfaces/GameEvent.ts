import { ServerEventName } from './ServerEvent';

export interface GameEvent {
  name: ServerEventName;
  data: any;
}

export enum Channel {
  PlayerMessage = 'playerMessage',

  // receive/send an event from the server
  EventMessage = 'eventMessage',


  // used to send/receive player chat messages
  PlayerChat = 'playerChat',

  // used to communicate updates to clients
  PlayerUpdates = 'playerUpdates',


  PlayerBuffs = 'playerBuffs',


  PlayerEvents = 'playerEvents',

  // internal: used to sync player add/remove between servers
  Players = 'players'
}
