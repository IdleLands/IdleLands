import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession, EventName } from '../../../../shared/interfaces';

export class Monster extends BaseProfession implements IProfession {

  public readonly oocAbilityName = 'Swap Fiend';
  public readonly oocAbilityDesc = 'Perform two switcheroos on yourself.';
  public readonly oocAbilityCost = 30;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 20
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  5,
    [Stat.STR]: 1.5,
    [Stat.DEX]: 1,
    [Stat.INT]: 0.5,
    [Stat.CON]: 3,
    [Stat.AGI]: 1.5,
    [Stat.LUK]: 0,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  10,
    [Stat.STR]: 2,
    [Stat.DEX]: 1,
    [Stat.INT]: 0,
    [Stat.CON]: 2,
    [Stat.AGI]: 0,
    [Stat.LUK]: 0,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0.2,
    [Stat.GOLD]: 0.2
  };

  public oocAbility(player: Player): {success: boolean, message: string} {
    player.$$game.eventManager.doEventFor(player, EventName.Switcheroo);
    player.$$game.eventManager.doEventFor(player, EventName.Switcheroo);
    this.emitProfessionMessage(player, 'You switched yourself around a bit!');
    return {success: true, message: `You've switched yourself around a bit!`};
  }
}
