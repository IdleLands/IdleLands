import { IPlayer } from './IPlayer';

export interface IGame {
  databaseManager: any;
  assetManager: any;
  playerManager: any;
  itemGenerator: any;
  eventManager: any;
  subscriptionManager: any;
  discordManager: any;
  achievementManager: any;
  personalityManager: any;
  movementHelper: any;
  holidayHelper: any;
  professionHelper: any;
  chatHelper: any;

  sendClientUpdateForPlayer(player: IPlayer): void;
}
