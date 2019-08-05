import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession, PermanentUpgrade } from '../../../../shared/interfaces';

export class Necromancer extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Minion';
  public readonly oocAbilityName = 'Bone Minions';
  public readonly oocAbilityDesc = 'Summon extra minions to join you in your next few combats.';
  public readonly oocAbilityCost = 60;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 2,
      [Stat.INT]: 5
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  1,
    [Stat.STR]: 0.3,
    [Stat.DEX]: 0.3,
    [Stat.INT]: 10,
    [Stat.CON]: 0.5,
    [Stat.AGI]: 0.1,
    [Stat.LUK]: 0.1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  5,
    [Stat.STR]: 1,
    [Stat.DEX]: 1,
    [Stat.INT]: 4,
    [Stat.CON]: 1,
    [Stat.AGI]: 0,
    [Stat.LUK]: 1,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   0,
    [Stat.GOLD]: 0
  };

  public oocAbility(player: Player): string {
    player.grantBuff({
      name: 'Bone Minions',
      statistic: 'Combat/All/Times/Total',
      booster: true,
      duration: 5,
      permanentStats: {
        [PermanentUpgrade.MaxPetsInCombat]: 1 + Math.floor(Math.log(player.ascensionLevel))
      }
    }, true);
    player.$$game.eventManager.doEventFor(player, 'Battle');

    return `You summoned some bone minions!`;
  }

  public determineStartingSpecial(): number {
    return 0;
  }

  public determineMaxSpecial(): number {
    return 3;
  }
}
