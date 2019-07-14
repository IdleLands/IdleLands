import { IGacha, IPlayer } from '../interfaces';

import { LootTable } from 'lootastic';

export abstract class BaseGachaRoller implements IGacha {
  abstract name = '???';
  abstract desc = '???';
  abstract rewards = [];
  abstract rollCost = 999;

  canRoll(player: IPlayer): boolean {
    return player.$premium.hasILP(this.rollCost);
  }

  roll() {
    const table = new LootTable(this.rewards);
    return table.chooseWithReplacement(1);
  }

  roll10() {
    const table = new LootTable(this.rewards);
    return table.chooseWithReplacement(10);
  }
}
