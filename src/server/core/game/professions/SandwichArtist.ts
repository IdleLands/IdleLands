import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class SandwichArtist extends BaseProfession implements IProfession {

  public readonly oocAbilityName = 'Panhandle';
  public readonly oocAbilityDesc = 'Give your party a GOLD buff based on your LUK for 720 ticks.';
  public readonly oocAbilityCost = 20;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 10
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  1,
    [Stat.STR]: 1.5,
    [Stat.DEX]: 1.5,
    [Stat.INT]: 1.5,
    [Stat.CON]: 1.5,
    [Stat.AGI]: 1.5,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  5,
    [Stat.STR]: 2,
    [Stat.DEX]: 2,
    [Stat.INT]: 2,
    [Stat.CON]: 2,
    [Stat.AGI]: 2,
    [Stat.LUK]: 2,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0.1,
    [Stat.GOLD]: 0.7
  };

  public oocAbility(player: Player): string {
    const luk = player.getStat(Stat.LUK);
    const numAbilUsesBonus = Math.floor(player.$statistics.get('Profession/SandwichArtist/AbilityUses') / 10);
    player.grantBuff({
      name: 'Panhandle',
      statistic: 'Character/Ticks',
      booster: true,
      duration: 720,
      stats: {
        [Stat.GOLD]: (Math.log(luk) * Math.log(player.level.total)) + numAbilUsesBonus
      }
    }, true);

    this.emitProfessionMessage(player, 'Your GOLD gain will be increased for 720 ticks!');
    return `Your GOLD gain will be increased for 720 ticks!`;
  }
}
