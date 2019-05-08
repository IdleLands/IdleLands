import { Profession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class MagicalMonster extends Profession implements IProfession {

  public readonly oocAbilityName = '???';
  public readonly oocAbilityDesc = '???';
  public readonly oocAbilityCost = 999;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 10
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  10,
    [Stat.STR]: 0.5,
    [Stat.DEX]: 0.5,
    [Stat.INT]: 3,
    [Stat.CON]: 0.5,
    [Stat.AGI]: 3,
    [Stat.LUK]: 5,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   2,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  50,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 5,
    [Stat.CON]: 1,
    [Stat.AGI]: 5,
    [Stat.LUK]: 2,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public oocAbility(player: Player): string {
    return `Not yet implemented!`;
  }
}
