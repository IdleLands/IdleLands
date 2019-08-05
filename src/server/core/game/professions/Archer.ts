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
      [Stat.CON]: 5,
      [Stat.DEX]: 2
    },
    [Stat.STR]: {
      [Stat.DEX]: 1
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  5,
    [Stat.STR]: 1.5,
    [Stat.DEX]: 2.5,
    [Stat.INT]: 0.5,
    [Stat.CON]: 1,
    [Stat.AGI]: 0.3,
    [Stat.LUK]: 0.7,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  25,
    [Stat.STR]: 1,
    [Stat.DEX]: 4,
    [Stat.INT]: 1,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  1,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {

    player.grantBuff({
      name: 'Pheromone',
      statistic: 'Combat/All/Times/Total',
      booster: true,
      duration: 5,
      permanentStats: {
        [PermanentUpgrade.MaxPetsInCombat]: 1 + Math.floor(Math.log(player.ascensionLevel))
      }
    }, true);

    return `More pets will join you in combat!`;
  }
}
