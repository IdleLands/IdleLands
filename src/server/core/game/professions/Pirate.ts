import { BaseProfession } from './Profession';
import { Stat } from '../../../../shared/interfaces/Stat';
import { Player } from '../../../../shared/models/entity';
import { IProfession, EventName } from '../../../../shared/interfaces';

export class Pirate extends BaseProfession implements IProfession {

  public readonly specialStatName = 'Bottle';
  public readonly oocAbilityName = 'Pillage';
  public readonly oocAbilityDesc = 'Acquire a random item.';
  public readonly oocAbilityCost = 30;

  public readonly statForStats = {
    [Stat.HP]: {
      [Stat.CON]: 5
    }
  };

  public readonly statMultipliers = {
    [Stat.HP]:  2,
    [Stat.STR]: 3,
    [Stat.DEX]: 2,
    [Stat.INT]: 0.1,
    [Stat.CON]: 1.5,
    [Stat.AGI]: 0.8,
    [Stat.LUK]: 0.5,

    [Stat.SPECIAL]:  0,

    [Stat.XP]:   1,
    [Stat.GOLD]: 1
  };

  public readonly statsPerLevel = {
    [Stat.HP]:  10,
    [Stat.STR]: 3,
    [Stat.DEX]: 2,
    [Stat.INT]: 0,
    [Stat.CON]: 2,
    [Stat.AGI]: 1,
    [Stat.LUK]: 0,

    [Stat.SPECIAL]:  1,

    [Stat.XP]:   0.2,
    [Stat.GOLD]: 1
  };

  public oocAbility(player: Player): { success: boolean, message: string } {

    const scaler = player.$statistics.get('Profession/Pirate/Become') || 1;

    const statScaled = player.getStat(Stat.LUK) * scaler;

    const foundItem = player.$$game.itemGenerator.generateItemForPlayer(player, {
      generateLevel: player.level.total + Math.max(1, Math.log(statScaled)),
      qualityBoost: 1
    });

    player.$$game.eventManager.doEventFor(player, EventName.FindItem, { fromPillage: true, item: foundItem });
    this.emitProfessionMessage(player, `You pillaged an item (${foundItem.name})!`);
    return { success: true, message: `You've pillaged an item (${foundItem.name})!` };
  }
}
