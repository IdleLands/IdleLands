import { Profession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class SandwichArtist extends Profession implements IProfession {

  public readonly oocAbilityName = '???';
  public readonly oocAbilityDesc = '???';
  public readonly oocAbilityCost = 999;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 10
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  1,
    [Stat.STR]: 2,
    [Stat.DEX]: 2,
    [Stat.INT]: 2,
    [Stat.CON]: 2,
    [Stat.AGI]: 2,
    [Stat.LUK]: 2,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  25,
    [Stat.STR]: 2,
    [Stat.DEX]: 2,
    [Stat.INT]: 2,
    [Stat.CON]: 2,
    [Stat.AGI]: 2,
    [Stat.LUK]: 2,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   5,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    return `Not yet implemented!`;
  }
}
