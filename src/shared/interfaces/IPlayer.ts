import { RestrictedNumber } from 'restricted-number';
import { IItem } from './IItem';

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

  availableGenders: string[];
  availableTitles: string[];

  $statisticsData: any;

  init(): void;
  loop(): Promise<void>;
  toSaveObject(): IPlayer;

  canLevelUp(): boolean;
  gainXP(num: number): void;
  recalculateStats(): void;

  equip(item: IItem): void;
  unequip(item: IItem): void;
}
