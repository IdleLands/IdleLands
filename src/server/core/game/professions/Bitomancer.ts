import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Bitomancer extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Bit';
  public readonly oocAbilityName = 'Hack The System';
  public readonly oocAbilityDesc = 'Improve your and your partys combat stats.';
  public readonly oocAbilityCost = 30;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5
    },
    [Stat.SPECIAL]: {
      [Stat.INT]: 2
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  0.9,
    [Stat.STR]: 0.3,
    [Stat.DEX]: 2,
    [Stat.INT]: 3,
    [Stat.CON]: 0.4,
    [Stat.AGI]: 0.5,
    [Stat.LUK]: 0.4,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  15,
    [Stat.STR]: 1,
    [Stat.DEX]: 3,
    [Stat.INT]: 4,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  4,

    [Stat.XP]:   0.7,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {

    const scaler = player.getStat(Stat.LUK) + player.getStat(Stat.INT);

    const stats = {};
    Object.values([Stat.STR, Stat.INT, Stat.CON]).forEach(stat => {
      stats[stat] = player.$$game.rngService.numberInRange(-5, Math.floor(Math.log(scaler) * player.level.total));
    });

    player.grantBuff({
      name: 'Bitomancer Hack',
      statistic: 'Combat/All/Times/Total',
      booster: true,
      duration: 3,
      stats
    }, true);

    this.emitProfessionMessage(player, `You hacked the system!`);
    return `You hacked the system!`;
  }

  public determineStartingSpecial(): number {
    return 0;
  }
}
