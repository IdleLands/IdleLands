import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Cleric extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Mana';
  public readonly oocAbilityName = 'Cure Injury';
  public readonly oocAbilityDesc = 'Cure an injury from each of your party members.';
  public readonly oocAbilityCost = 20;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 3
    },
    [Stat.SPECIAL]: {
      [Stat.INT]: 7
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  2.2,
    [Stat.STR]: 0.9,
    [Stat.DEX]: 0.6,
    [Stat.INT]: 1.7,
    [Stat.CON]: 1.2,
    [Stat.AGI]: 0.4,
    [Stat.LUK]: 0.7,

    [Stat.SPECIAL]:  1,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  5,
    [Stat.STR]: 1.2,
    [Stat.DEX]: 1.3,
    [Stat.INT]: 1.5,
    [Stat.CON]: 1.6,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  1,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    player.$$game.eventManager.doEventFor(player, 'BattleBoss', { bossName: 'dChicken Problem Solver' });
    player.giveCure();
    return 'You cured the wounds of yourself and your allies!';
  }
}
