import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Pirate extends BaseProfession implements IProfession {

  public readonly oocAbilityName = 'Pillage';
  public readonly oocAbilityDesc = 'Acquire a random item.';
  public readonly oocAbilityCost = 999;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 20
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  10,
    [Stat.STR]: 5,
    [Stat.DEX]: 4,
    [Stat.INT]: 0.1,
    [Stat.CON]: 4,
    [Stat.AGI]: 2,
    [Stat.LUK]: 0.3,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  25,
    [Stat.STR]: 3,
    [Stat.DEX]: 2,
    [Stat.INT]: 0,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 0,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    return `Not yet implemented!`;
  }
}
