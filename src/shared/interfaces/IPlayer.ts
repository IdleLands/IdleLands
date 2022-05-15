import { RestrictedNumber } from 'restricted-number';
import { IItem } from './IItem';
import { IChoice } from './IChoice';
import { ServerEventName } from './ServerEvent';
import { IProfession } from './IProfession';
import { IBuff } from './IBuff';
import { IParty } from './IParty';
import { Stat } from './Stat';
import { ModeratorTier } from './Moderation';

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

export enum Profession {
  Archer = 'Archer',
  Barbarian = 'Barbarian',
  Bard = 'Bard',
  Bitomancer = 'Bitomancer',
  Cleric = 'Cleric',
  Fighter = 'Fighter',
  Generalist = 'Generalist',
  Jester = 'Jester',
  Mage = 'Mage',
  MagicalMonster = 'MagicalMonster',
  Monster = 'Monster',
  Necromancer = 'Necromancer',
  Pirate = 'Pirate',
  Rogue = 'Rogue',
  SandwichArtist = 'SandwichArtist'
}

export interface ICharacter {
  name: string;
  level: RestrictedNumber;
  gender: string;
  currentStats: { [key in Stat]: number };

  init(): void;
  recalculateStats(): void;

  getStat(stat: Stat): number;

  equip(item: IItem): void;
  unequip(item: IItem): void;
}

export interface IPlayer extends ICharacter {
  _id: string;

  userId: string;
  sessionId: string;
  authId: string;
  authType: string;
  authSyncedTo: string;
  modTier: ModeratorTier;
  discordTag: string;
  il3CharName: string;

  createdAt: number;

  profession: Profession;

  stamina: RestrictedNumber;
  xp: RestrictedNumber;

  gold: number;

  x: number;
  y: number;
  map: string;
  loggedIn: boolean;
  ascensionLevel: number;
  cooldowns: { [key: string]: number };

  eventSteps: number;

  availableGenders: string[];
  availableTitles: string[];

  $profession: any;
  $professionData: any;

  $statistics: any;
  $statisticsData: any;

  $inventory: any;
  $inventoryData: any;

  $choices: any;
  $choicesData: any;

  $achievements: any;
  $achievementsData: any;

  $personalities: any;
  $personalitiesData: any;

  $collectibles: any;
  $collectiblesData: any;

  $pets: any;
  $petsData: any;

  $premium: any;
  $premiumData: any;

  $quests: any;
  $questsData: any;
  nextQuestRerollAvailability: number;

  lastDir: Direction;
  lastLoc: { map: string, x: number, y: number };
  divineDirection?: { x: number, y: number, steps: number };
  buffWatches: { [key in Stat]?: IBuff[] };

  $party?: IParty;

  guildName?: string;

  loop(tick: number): Promise<void>;
  toSaveObject(): IPlayer;

  canLevelUp(): boolean;
  gainXP(num: number, addMyXP: boolean): number;
  resetMaxXP(): void;
  gainGold(num: number, addMyGold: boolean): number;
  spendGold(num: number): number;

  alwaysTryAddToInventory(item: IItem): void;
  sellItem(item: IItem): number;
  salvageItem(item: IItem): { wood: number, clay: number, stone: number, astralium: number };

  changeProfessionWithRef(profession: string): void;
  changeProfession(profession: IProfession): void;

  doChoice(choice: IChoice, decisionIndex: number): void;

  emit(evt: ServerEventName, data: any): void;

  getDefaultChoice(str: string[]): string;
  hasPersonality(pers: string): boolean;

  hasAchievement(achievement: string): boolean;
  hasCollectible(collectible: string): boolean;
  tryFindCollectible({ name, rarity, description, storyline }): void;

  increaseStatistic(stat: string, val: number): void;

  forceUnequip(item: IItem): void;

  addBuff(buff: IBuff): void;
  grantBuff(buff: IBuff, canShare: boolean): void;

  gainILP(ilp: number): void;

  setDivineDirection(x: number, y: number): void;
  setPos(x: number, y: number, map: string, region: string): void;

  changeGender(newGender: string): void;
  changeTitle(newTitle: string): void;

  tryToDoNewCharacter(): void;

  oocAction(): { success: boolean, message: string };
  petOOCAction(): { success: boolean, message: string };

  injuryCount(): number;
  cureInjury(): void;
}
