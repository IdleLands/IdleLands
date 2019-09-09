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

  // internal: used to sync global quest data between servers
  GlobalQuest = 'internal:globalquest',

  // internal: used to sync guild data between servers
  Guild = 'internal:guild'
}

export enum EventMessageType {
  Battle = 'battle',
  BlessGold = 'blessGold',
  BlessGoldParty = 'blessGoldParty',
  BlessItem = 'blessItem',
  BlessXP = 'blessXp',
  BlessXPParty = 'blessXpParty',
  Enchant = 'enchant',
  FindItem = 'findItem',
  Switcheroo = 'flipStat',
  ForsakeGold = 'forsakeGold',
  ForsakeItem = 'forsakeItem',
  ForsakeXP = 'forsakeXp',
  LevelDown = 'levelDown',
  Merchant = 'merchant',
  Party = 'party',
  Providence = 'providence',
  Tinker = 'tinker',
  Witch = 'witch'
}

export enum EventName {
  Battle = 'Battle',
  BattlePvP = 'BattlePvP',
  BattleBoss = 'BattleBoss',
  BlessGold = 'BlessGold',
  BlessGoldParty = 'BlessGoldParty',
  BlessItem = 'BlessItem',
  BlessXP = 'BlessXP',
  BlessXPParty = 'BlessXPParty',
  Enchant = 'Enchant',
  FindItem = 'FindItem',
  FindTrainer = 'FindTrainer',
  FindTreasure = 'FindTreasure',
  ForsakeGold = 'ForsakeGold',
  ForsakeItem = 'ForsakeItem',
  ForsakeXP = 'ForsakeXP',
  Gamble = 'Gamble',
  Merchant = 'Merchant',
  Party = 'Party',
  PartyLeave = 'PartyLeave',
  Providence = 'Providence',
  Switcheroo = 'Switcheroo',
  TownCrier = 'TownCrier',
  Witch = 'Witch'
}
