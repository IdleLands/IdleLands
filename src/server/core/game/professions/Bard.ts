import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Bard extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Song';
  public readonly oocAbilityName = 'Orchestra';
  public readonly oocAbilityDesc = 'Start a festival that lasts an hour.';
  public readonly oocAbilityCost = 1;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  10,
    [Stat.STR]: 1,
    [Stat.DEX]: 5,
    [Stat.INT]: 4,
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
    [Stat.DEX]: 3,
    [Stat.INT]: 2,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    player.$$game.eventManager.doEventFor(player, 'Battle');
    return `Not yet implemented!`;
  }

  public determineStartingSpecial(): number {
    return 0;
  }

  public determineMaxSpecial(): number {
    return 3;
  }
}
