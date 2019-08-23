import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession, EventName } from '../../../../shared/interfaces';

export class Rogue extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Energy';
  public readonly oocAbilityName = '"Good Luck"';
  public readonly oocAbilityDesc = 'Create a positively golden windfall for yourself.';
  public readonly oocAbilityCost = 30;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 2
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  2,
    [Stat.STR]: 1.5,
    [Stat.DEX]: 3,
    [Stat.INT]: 0.8,
    [Stat.CON]: 0.8,
    [Stat.AGI]: 3,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  15,
    [Stat.STR]: 2,
    [Stat.DEX]: 2,
    [Stat.INT]: 1,
    [Stat.CON]: 0,
    [Stat.AGI]: 2,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0.1,
    [Stat.GOLD]: 1.2
  };

  public oocAbility(player: Player): { success: boolean, message: string } {
    player.$$game.eventManager.doEventFor(player, EventName.BlessGold);
    player.$$game.eventManager.doEventFor(player, EventName.Gamble);
    player.$$game.eventManager.doEventFor(player, EventName.Merchant);
    this.emitProfessionMessage(player, 'You took a trip to the golden city!');
    return { success: true, message: `You took a trip to the golden city!` };
  }

  public determineStartingSpecial(): number {
    return 100;
  }

  public determineMaxSpecial(): number {
    return 100;
  }
}
