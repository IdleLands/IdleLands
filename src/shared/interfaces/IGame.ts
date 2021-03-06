import { IPlayer } from './IPlayer';

export interface IGame {
  databaseManager: any;
  assetManager: any;
  playerManager: any;
  itemGenerator: any;
  eventManager: any;
  subscriptionManager: any;
  discordManager: any;
  buffManager: any;
  achievementManager: any;
  personalityManager: any;
  movementHelper: any;
  holidayHelper: any;
  professionHelper: any;
  chatHelper: any;
  partyManager: any;
  rngService: any;
  partyHelper: any;
  petHelper: any;
  combatHelper: any;
  calculatorHelper: any;
  festivalManager: any;
  questHelper: any;
  globalQuestManager: any;
  stripeHelper: any;
  gmHelper: any;
  guildManager: any;

  updatePlayer(player: IPlayer): void;
  sendClientUpdateForPlayer(player: IPlayer): void;
  doStartingPlayerStuff(player: IPlayer): void;
}
