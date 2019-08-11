import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';
import { EventName } from '../events/Event';

export class Barbarian extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Rage';
  public readonly oocAbilityName = 'Duel';
  public readonly oocAbilityDesc = 'Begin a duel with a random player.';
  public readonly oocAbilityCost = 30;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 10,
      [Stat.STR]: 5,
      [Stat.INT]: -2
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  1,
    [Stat.STR]: 3,
    [Stat.DEX]: 1,
    [Stat.INT]: 0,
    [Stat.CON]: 3,
    [Stat.AGI]: 0.1,
    [Stat.LUK]: 0.1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  35,
    [Stat.STR]: 5,
    [Stat.DEX]: 1,
    [Stat.INT]: 0,
    [Stat.CON]: 3,
    [Stat.AGI]: 0,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0.1,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    player.$$game.eventManager.doEventFor(player, EventName.BattlePvP);
    this.emitProfessionMessage(player, `You seek out a worthy opponent!`);
    return `You seek out a worthy opponent!`;
  }

  public determineStartingSpecial(): number {
    return 0;
  }

  public determineMaxSpecial(): number {
    return 100;
  }
}
