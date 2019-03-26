import { RestrictedNumber } from 'restricted-number';
import { IItem } from './IItem';
import { IChoice } from './IChoice';

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

  eventSteps: number;

  availableGenders: string[];
  availableTitles: string[];

  $statisticsData: any;
  $inventoryData: any;

  init(): void;
  loop(): Promise<void>;
  toSaveObject(): IPlayer;

  canLevelUp(): boolean;
  gainXP(num: number): number;
  gainGold(num: number): number;
  recalculateStats(): void;

  equip(item: IItem): void;
  unequip(item: IItem): void;

  alwaysTryAddToInventory(item: IItem): void;
  sellItem(item: IItem): number;

  doChoice(choice: IChoice, decisionIndex: number): void;
}
