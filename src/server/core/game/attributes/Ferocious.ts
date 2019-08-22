import { Player } from '../../../../shared/models/entity';
import { IAttribute, EventName } from '../../../../shared/interfaces';
import { BaseAttribute } from '../professions/Profession';

export class Ferocious extends BaseAttribute implements IAttribute {

  public readonly oocAbilityName = 'Fight';
  public readonly oocAbilityDesc = 'Fight some monsters!';
  public readonly oocAbilityCost = 35;

  public oocAbility(player: Player): {success: boolean, message: string} {
    player.$$game.eventManager.doEventFor(player, EventName.Battle);
    return {success: true, message: `Your pet started a fight!`};
  }
}
