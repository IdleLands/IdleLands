import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Fighter extends BaseProfession implements IProfession {

  public readonly oocAbilityName = 'Experiencer';
  public readonly oocAbilityDesc = 'Give your party an XP buff based on your LUK.';
  public readonly oocAbilityCost = 20;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5,
      [Stat.STR]: 2
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  5,
    [Stat.STR]: 2.5,
    [Stat.DEX]: 1.5,
    [Stat.INT]: 0.4,
    [Stat.CON]: 1.3,
    [Stat.AGI]: 1.1,
    [Stat.LUK]: 0.7,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  25,
    [Stat.STR]: 3,
    [Stat.DEX]: 2,
    [Stat.INT]: 1,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0.1,
    [Stat.GOLD]: 0
  };


  public oocAbility(player: Player): { success: boolean, message: string } {
    const scaler = player.$statistics.get('Profession/Fighter/Become') || 1;

    const luk = player.getStat(Stat.LUK) * scaler;

    player.grantBuff({
      name: 'Experiencer',
      statistic: 'Character/Ticks',
      booster: true,
      duration: 720,
      stats: {
        [Stat.XP]: Math.log(luk) * Math.log(player.level.total * scaler)
      }
    }, true);

    this.emitProfessionMessage(player, `Your XP gain will be increased for 720 ticks!`);
    return { success: true, message: `Your XP gain will be increased for 720 ticks!` };
  }
}
