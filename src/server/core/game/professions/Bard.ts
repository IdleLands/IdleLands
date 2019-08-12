import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession, IFestival } from '../../../../shared/interfaces';

export class Bard extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Song';
  public readonly oocAbilityName = 'Orchestra';
  public readonly oocAbilityDesc = 'Start a random festival that lasts an hour.';
  public readonly oocAbilityCost = 60;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  1.3,
    [Stat.STR]: 1,
    [Stat.DEX]: 3,
    [Stat.INT]: 2,
    [Stat.CON]: 1,
    [Stat.AGI]: 0.7,
    [Stat.LUK]: 0.8,

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

    [Stat.XP]:   0.4,
    [Stat.GOLD]: 0.7
  };

  public oocAbility(player: Player): string {

    const stats = {};
    Object.values(Stat).forEach(stat => {
      stats[stat] = player.$$game.rngService.numberInRange(-10, 10);
    });

    const festival: IFestival = {
      name: `${player.name}'s Bardic Festival`,
      endTime: Date.now() + (1000 * 60 * 60),
      startedBy: player.name,
      stats
    };

    player.$$game.festivalManager.startFestival(player, festival);

    this.emitProfessionMessage(player, `You sing the song of your people!`);
    return `You sing the song of your people!`;
  }

  public determineStartingSpecial(): number {
    return 0;
  }

  public determineMaxSpecial(): number {
    return 3;
  }
}
