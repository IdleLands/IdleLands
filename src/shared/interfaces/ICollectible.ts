import { ItemClass } from './IItem';

export interface ICollectible {
  name: string;
  count: number;
  touched: number;
  map: string;
  rarity: ItemClass;
  region: string;
  description: string;
  storyline: string;
  foundAt: number;
}
