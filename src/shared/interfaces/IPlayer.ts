import { RestrictedNumber } from 'restricted-number';

export interface IPlayer {
  _id: string;

  userId: string;
  sessionId: string;
  authId: string;
  authType: string;
  authSyncedTo: string;

  createdAt: number;

  name: string;
  level: RestrictedNumber;
  xp: RestrictedNumber;
  profession: string;
  gender: string;
  x: number;
  y: number;
  map: string;
  loggedIn: boolean;

  $possibleGenders: string[];
  $titles: string[];

  loop(): void;
  toSaveObject(): IPlayer;
}
