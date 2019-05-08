import { Profession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Archer extends Profession implements IProfession {

  public readonly oocAbilityName = '???';
  public readonly oocAbilityDesc = '???';
  public readonly oocAbilityCost = 999;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5,
      [Stat.DEX]: 2
    },
    [Stat.STR]: {
      [Stat.DEX]: 1
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  5,
    [Stat.STR]: 1.5,
    [Stat.DEX]: 2.5,
    [Stat.INT]: 0.5,
    [Stat.CON]: 1,
    [Stat.AGI]: 0.3,
    [Stat.LUK]: 0.7,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  25,
    [Stat.STR]: 1,
    [Stat.DEX]: 4,
    [Stat.INT]: 1,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    return `Not yet implemented!`;
  }
}
