import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession, EventName } from '../../../../shared/interfaces';

export class MagicalMonster extends BaseProfession implements IProfession {

  public readonly oocAbilityName = 'Tempt Fate';
  public readonly oocAbilityDesc = 'Sing a fateful song, and find out what happens next!';
  public readonly oocAbilityCost = 30;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 10
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  0.8,
    [Stat.STR]: 0.5,
    [Stat.DEX]: 0.5,
    [Stat.INT]: 3,
    [Stat.CON]: 0.7,
    [Stat.AGI]: 3,
    [Stat.LUK]: 5,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   2,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  10,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 5,
    [Stat.CON]: 1,
    [Stat.AGI]: 5,
    [Stat.LUK]: 2,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0.2,
    [Stat.GOLD]: 0.1
  };

  public oocAbility(player: Player): string {
    player.$$game.eventManager.doEventFor(player, EventName.Providence);
    this.emitProfessionMessage(player, 'You tempted fate!');
    return {success: true, message: `You've tempted fate! Your adventure log has the details.`};
  }
}
