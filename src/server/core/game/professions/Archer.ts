import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession, PermanentUpgrade } from '../../../../shared/interfaces';

export class Archer extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Arrow';
  public readonly oocAbilityName = 'Pet Phenomenon';
  public readonly oocAbilityDesc = 'Bring more pets to aid you in combat.';
  public readonly oocAbilityCost = 30;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 3,
      [Stat.DEX]: 2
    },
    [Stat.STR]: {
      [Stat.DEX]: 1
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  3,
    [Stat.STR]: 1.5,
    [Stat.DEX]: 2.5,
    [Stat.INT]: 0.8,
    [Stat.CON]: 1,
    [Stat.AGI]: 0.9,
    [Stat.LUK]: 0.9,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  15,
    [Stat.STR]: 1,
    [Stat.DEX]: 4,
    [Stat.INT]: 1,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  1,

    [Stat.XP]:   0.1,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {

    player.grantBuff({
      name: 'Pheromone',
      statistic: 'Combat/All/Times/Total',
      booster: true,
      duration: 5 + player.ascensionLevel,
      permanentStats: {
        [PermanentUpgrade.MaxPetsInCombat]: 1 + Math.floor(Math.log(player.ascensionLevel))
      }
    }, true);

    this.emitProfessionMessage(player, 'You used your special ability to bring more pets into combat!');
    return {success: true, message: `More pets will join you in combat!`};
  }
}
