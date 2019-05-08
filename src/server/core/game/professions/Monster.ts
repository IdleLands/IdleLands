import { Profession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Monster extends Profession implements IProfession {

  public readonly oocAbilityName = '???';
  public readonly oocAbilityDesc = '???';
  public readonly oocAbilityCost = 999;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 20
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  5,
    [Stat.STR]: 3,
    [Stat.DEX]: 3,
    [Stat.INT]: 0.5,
    [Stat.CON]: 5,
    [Stat.AGI]: 3,
    [Stat.LUK]: 0,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  20,
    [Stat.STR]: 2,
    [Stat.DEX]: 1,
    [Stat.INT]: 0,
    [Stat.CON]: 2,
    [Stat.AGI]: 0,
    [Stat.LUK]: 0,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    return `Not yet implemented!`;
  }
}
