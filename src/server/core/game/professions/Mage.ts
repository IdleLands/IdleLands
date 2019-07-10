import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Mage extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Mana';
  public readonly oocAbilityName = 'Alchemy';
  public readonly oocAbilityDesc = 'Gain GOLD based on your INT.';
  public readonly oocAbilityCost = 20;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5
    },
    [Stat.SPECIAL]: {
      [Stat.INT]: 10
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  2,
    [Stat.STR]: 0.5,
    [Stat.DEX]: 0.5,
    [Stat.INT]: 2.5,
    [Stat.CON]: 1,
    [Stat.AGI]: 0.2,
    [Stat.LUK]: 0.6,

    [Stat.SPECIAL]:  1,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  5,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 2,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  1,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    const int = player.getStat(Stat.INT);
    const goldGained = player.gainGold(int);
    return `You gained ${goldGained.toLocaleString()} GOLD!`;
  }
}