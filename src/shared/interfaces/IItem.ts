import { Stat } from './Stat';
import { IPlayer } from './IPlayer';

export enum ItemSlot {
  Body = 'body',
  Charm = 'charm',
  Feet = 'feet',
  Finger = 'finger',
  Hands = 'hands',
  Head = 'head',
  Legs = 'legs',
  Neck = 'neck',
  Mainhand = 'mainhand',
  Offhand = 'offhand',
  Providence = 'providence',
  Soul = 'soul',
  Trinket = 'trinket'
}

export enum ItemClass {
  Newbie = 'newbie',
  Basic = 'basic',
  Pro = 'pro',
  Idle = 'idle',
  Godly = 'godly',
  Goatly = 'goatly',
  Omega = 'omega',
  Guardian = 'guardian'
}

export const GenerateableItemSlot = Object
  .keys(ItemSlot)
  .map(slot => ItemSlot[slot])
  .filter(x => x !== ItemSlot.Providence && x !== ItemSlot.Soul && x !== ItemSlot.Trinket);

export interface IItem {
  id: string;

  name: string;

  type: ItemSlot;

  baseScore: number;
  score: number;

  itemClass: ItemClass;
  enchantLevel: number;
  stats: { [key in Stat]?: number };

  locked: boolean;

  init(opts: PartialItem): void;

  fullName(): string;

  woodValue(player: IPlayer): number;
  clayValue(player: IPlayer): number;
  stoneValue(player: IPlayer): number;
  astraliumValue(player: IPlayer): number;

  isCurrentlyEnchantable(player: IPlayer): boolean;
  isUnderBoostablePercent(player: IPlayer): boolean;
}

export type PartialItem = {
  [P in keyof IItem]?: IItem[P];
};

export enum TeleportItemLocation {
  AstralTown = 'Astral Town',
  FrigriTown = 'Frigri Town',
  HomletTown = 'Homlet Town',
  MaelesTown = 'Maeles Town',
  NorkosTown = 'Norkos Town',
  RaburroTown = 'Raburro Town',
  VocalnusTown = 'Vocalnus Town',
  DesertTown = 'Desert Town',
  TreeTown = 'Tree Town'
}

export interface IBuffScrollItem {
  id: string;
  name: string;
  stats: { [key in Stat]?: number };
  expiresAt: number;
}
