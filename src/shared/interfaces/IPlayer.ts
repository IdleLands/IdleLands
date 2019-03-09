
export interface IPlayer {
  _id: string;

  userId: string;
  sessionId: string;
  authId: string;
  authType: string;
  authSyncedTo: string;

  createdAt: number;

  name: string;
  level: number;
  profession: string;
  gender: string;
  x: number;
  y: number;
  map: string;
  loggedIn: boolean;

  loop(): void;
  toSaveObject(): IPlayer;
}
