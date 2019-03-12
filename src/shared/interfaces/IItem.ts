import { Stat } from './Stat';
import { IPlayer } from './IPlayer';

export type ItemSlot = 'body' | 'charm' | 'feet' | 'finger' | 'hands'
                     | 'head' | 'legs' | 'neck' | 'mainhand' | 'offhand'
                     | 'providence' | 'soul' | 'trinket';

export type ItemClass = 'newbie' | 'basic' | 'pro' | 'idle' | 'godly' | 'goatly' | 'omega';

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
