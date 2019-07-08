import { Player } from '../../../../shared/models/entity';
import { IAttribute } from '../../../../shared/interfaces';
import { BaseAttribute } from '../professions/Profession';

export class Blessed extends BaseAttribute implements IAttribute {

  public readonly oocAbilityName = 'Bless';
  public readonly oocAbilityDesc = 'Activate a random Bless event.';
  public readonly oocAbilityCost = 15;

  public oocAbility(player: Player): string {
    const event = (<any>player).$game.rngService.weighted(['BlessItem', 'BlessGold', 'BlessXP', 'Enchant'], [100, 300, 100, 5]);
    (<any>player).$game.eventManager.doEventFor(player, event);
    return `You've been #blessed!`;
  }
}
