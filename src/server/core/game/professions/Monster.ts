import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';
import { EventName } from '../events/Event';

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
    [Stat.STR]: 3,
    [Stat.DEX]: 3,
    [Stat.INT]: 0.5,
    [Stat.CON]: 5,
    [Stat.AGI]: 3,
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

    [Stat.XP]:   0.4,
    [Stat.GOLD]: 0.2
  };

  public oocAbility(player: Player): string {
    player.$$game.eventManager.doEventFor(player, EventName.Switcheroo);
    player.$$game.eventManager.doEventFor(player, EventName.Switcheroo);
    this.emitProfessionMessage(player, 'You switched yourself around a bit!');
    return `You've switched yourself around a bit!`;
  }
}
