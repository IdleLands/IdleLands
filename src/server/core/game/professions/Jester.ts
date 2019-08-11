
import { sample } from 'lodash';

import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { IProfession } from '../../../../shared/interfaces';
import { GoodMessages } from '../../static/good-messages';
import { Player } from '../../../../shared/models';

export class Jester extends BaseProfession implements IProfession {

  public readonly oocAbilityName = 'Jest';
  public readonly oocAbilityDesc = 'Surely you jest.';
  public readonly oocAbilityCost = 1;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.LUK]: 5
    },
    [Stat.STR]: {
      [Stat.LUK]: 1
    },
    [Stat.DEX]: {
      [Stat.LUK]: 1
    },
    [Stat.INT]: {
      [Stat.LUK]: 1
    },
    [Stat.CON]: {
      [Stat.LUK]: 1
    },
    [Stat.AGI]: {
      [Stat.LUK]: 1
    },
    [Stat.GOLD]: {
      [Stat.LUK]: 0.01
    },
    [Stat.XP]: {
      [Stat.LUK]: 0.01
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  1,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 1,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  0,
    [Stat.STR]: 0,
    [Stat.DEX]: 0,
    [Stat.INT]: 0,
    [Stat.CON]: 0,
    [Stat.AGI]: 0,
    [Stat.LUK]: 5,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    const msg = sample(GoodMessages);
    this.emitProfessionMessage(player, `${msg}...`);
    return `${msg}...`;
  }
}
