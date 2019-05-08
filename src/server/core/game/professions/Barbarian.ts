import { Profession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Barbarian extends Profession implements IProfession {

  public readonly oocAbilityName = '???';
  public readonly oocAbilityDesc = '???';
  public readonly oocAbilityCost = 999;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 10,
      [Stat.STR]: 5
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  1,
    [Stat.STR]: 3,
    [Stat.DEX]: 1,
    [Stat.INT]: 0,
    [Stat.CON]: 3,
    [Stat.AGI]: 0.1,
    [Stat.LUK]: 0.1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  50,
    [Stat.STR]: 5,
    [Stat.DEX]: 1,
    [Stat.INT]: 0,
    [Stat.CON]: 3,
    [Stat.AGI]: 0,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    return `Not yet implemented!`;
  }
}
