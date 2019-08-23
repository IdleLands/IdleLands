import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession } from '../../../../shared/interfaces';

export class Mage extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Mana';
  public readonly oocAbilityName = 'Alchemy';
  public readonly oocAbilityDesc = 'Gain GOLD based on your INT.';
  public readonly oocAbilityCost = 10;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5
    },
    [Stat.SPECIAL]: {
      [Stat.INT]: 10
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  0.8,
    [Stat.STR]: 0.5,
    [Stat.DEX]: 0.5,
    [Stat.INT]: 2.3,
    [Stat.CON]: 1,
    [Stat.AGI]: 0.2,
    [Stat.LUK]: 0.8,

    [Stat.SPECIAL]:  1,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  5,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 2,
    [Stat.CON]: 1,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  1,

    [Stat.XP]:   0.3,
    [Stat.GOLD]: 0.5
  };


public oocAbility(player: Player): { success: boolean, message: string } {

    const scaler = player.$statistics.get('Profession/Mage/Become') || 1;

    const int = player.getStat(Stat.INT) * scaler;
    const goldGained = Math.max(player.gainGold(int), 10);
    this.emitProfessionMessage(player, `You gained ${goldGained.toLocaleString()} GOLD via Alchemy!`);
    return { success: true, message: `You gained ${goldGained.toLocaleString()} GOLD!` };
  }
}
