import { RestrictedNumber } from 'restricted-number';
import { IItem } from './IItem';
import { IChoice } from './IChoice';
import { ServerEventName } from './ServerEvent';

export enum Direction {
  Southwest = 1,
  South = 2,
  Southeast = 3,
  West = 4,
  Nowhere = 5,
  East = 6,
  Northwest = 7,
  North = 8,
  Northeast = 9
}

export enum MovementType {
  Ascend = 'ascend',
  Descend = 'descend',
  Fall = 'fall',
  Teleport = 'teleport'
}

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

  $professionData: any;
  $statisticsData: any;
  $inventoryData: any;
  $choicesData: any;
  $achievementsData: any;
  $personalitiesData: any;

  lastDir: Direction;

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

  emit(evt: ServerEventName, data: any): void;

  getDefaultChoice(str: string[]): string;
  hasPersonality(pers: string): boolean;

  hasAchievement(achievement: string): boolean;
  hasCollectible(collectible: string): boolean;
  tryFindCollectible({ name, rarity, description, storyline }): void;

  increaseStatistic(stat: string, val: number): void;
}
