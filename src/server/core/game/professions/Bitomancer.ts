import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Bitomancer extends BaseProfession implements IProfession {

  public readonly oocAbilityName = 'Hack';
  public readonly oocAbilityDesc = 'Decrease your Forsake event rate significantly.';
  public readonly oocAbilityCost = 999;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  2,
    [Stat.STR]: 0.3,
    [Stat.DEX]: 2,
    [Stat.INT]: 6,
    [Stat.CON]: 0.2,
    [Stat.AGI]: 0.3,
    [Stat.LUK]: 0.1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  45,
    [Stat.STR]: 1,
    [Stat.DEX]: 4,
    [Stat.INT]: 5,
    [Stat.CON]: 1,
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
