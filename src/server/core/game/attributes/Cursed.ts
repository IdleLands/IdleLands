import { Player } from '../../../../shared/models/entity';
import { IAttribute } from '../../../../shared/interfaces';
import { BaseAttribute } from '../professions/Profession';

export class Cursed extends BaseAttribute implements IAttribute {

  public readonly oocAbilityName = 'Curse';
  public readonly oocAbilityDesc = 'Activate a random Forsake event.';
  public readonly oocAbilityCost = 5;

  public oocAbility(player: Player): string {
    const event = player.$$game.rngService.weighted(['ForsakeItem', 'ForsakenGold', 'ForsakenXP', 'Switcheroo'], [50, 50, 50, 5]);
    player.$$game.eventManager.doEventFor(player, event);
    return `You've been #cursed!`;
  }
}
