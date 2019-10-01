import { BaseProfession } from './Profession';
import { Stat, AllStatsButSpecialInclSalvage } from '../../../../shared/interfaces/Stat';
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

    [Stat.XP]:   0.2,
    [Stat.GOLD]: 0.7
  };

  public oocAbility(player: Player): { success: boolean, message: string } {

    const scaler = (player.$statistics.get('Profession/Bard/AbilityUses') || 1) + (player.$statistics.get('Profession/Bard/Become') || 1);
    const bardicShift = Math.sqrt(scaler / 2);

    const luk = player.getStat(Stat.LUK);
    const range = Math.round(Math.log10(luk));

    const stats = { };
    Object.values(AllStatsButSpecialInclSalvage).forEach(stat => {
      let val = Math.floor(player.$$game.rngService.numberInRange(bardicShift * (-11 + range), bardicShift * (9 + range)));
      if(val === 0) return;

      if(stat === Stat.SALVAGE) {
        val = Math.floor(val / 3);
      }

      if(stat === Stat.XP || stat === Stat.GOLD) {
        val = Math.floor(val / 2);
      }

      stats[stat] = val;
    });

    if(player.$$game.festivalManager.hasFestivalWithName(`${player.name}'s Bardic Festival`)) {
      this.emitProfessionMessage(player, `You already have a Bardic Festival active.`);
      return { success: false, message: `You already have a Bardic Festival active.` };
    }

    const festival: IFestival = {
      name: `${player.name}'s Bardic Festival`,
      endTime: Date.now() + (1000 * 60 * 60),
      startedBy: `${player.name} the Bard`,
      stats
    };

    player.$$game.festivalManager.startFestival(player, festival);

    this.emitProfessionMessage(player, `You sing the song of your people!`);
    return { success: true, message: `You sing the song of your people!` };
  }

  public determineStartingSpecial(): number {
    return 0;
  }

  public determineMaxSpecial(): number {
    return 3;
  }
}
