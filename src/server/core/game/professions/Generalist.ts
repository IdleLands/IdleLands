import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Generalist extends BaseProfession implements IProfession {

  public readonly oocAbilityName = 'Generalize';
  public readonly oocAbilityDesc = 'Gain XP based on your LUK.';
  public readonly oocAbilityCost = 10;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  2,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 1,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 2,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1.1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  7,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 1,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0.2,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    const luk = player.getStat(Stat.LUK);
    const xpGained = Math.max(player.gainXP(luk), 10);
    this.emitProfessionMessage(player, `You gained ${xpGained.toLocaleString()} XP via Generalize!`);
    return {success: true, message: `You gained ${xpGained.toLocaleString()} XP!`};
  }
}
