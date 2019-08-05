import { ServerEventName } from './ServerEvent';

export interface GameEvent {
  name: ServerEventName;
  data: any;
}

export enum Channel {

  // party create, remove, modify
  Party = 'party',

  // receive/send an event from the server
  PlayerAdventureLog = 'eventMessage',

  // used to send/receive player chat messages
  PlayerChat = 'playerChat',

  // used to communicate updates to clients
  PlayerUpdates = 'playerUpdates',

  // internal: used to sync player add/remove between servers
  Players = 'internal:players',

  // internal: used to sync player buff grants (party buffers)
  PlayerBuff = 'internal:playerBuffs',

  // internal: used to sync player events for parties (blessxp, blessgold)
  PlayerEvent = 'internal:playerEvents',

  // internal: used to sync festivals between servers
  Festivals = 'internal:festivals',

  // internal: used to sync game settings between servers
  GameSettings = 'internal:gamesettings',
}
