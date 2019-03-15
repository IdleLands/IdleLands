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
  Omega = 'omega'
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

  init(opts): void;

  woodValue(player: IPlayer): number;
  clayValue(player: IPlayer): number;
  stoneValue(player: IPlayer): number;
  astraliumValue(player: IPlayer): number;

  isCurrentlyEnchantable(player: IPlayer): boolean;
  isUnderBoostablePercent(player: IPlayer): boolean;
}
