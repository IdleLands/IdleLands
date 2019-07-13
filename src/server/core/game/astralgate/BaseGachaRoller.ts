import { IGacha } from '../../../../shared/interfaces';

import { LootTable } from 'lootastic';
import { Player } from '../../../../shared/models';

export abstract class BaseGachaRoller implements IGacha {
  abstract name = '???';
  abstract rewards = [];
  abstract rollCost = 999;

  canRoll(player: Player): boolean {
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
