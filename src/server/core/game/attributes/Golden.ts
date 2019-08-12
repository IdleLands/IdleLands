import { Player } from '../../../../shared/models/entity';
import { IAttribute } from '../../../../shared/interfaces';
import { BaseAttribute } from '../professions/Profession';

export class Golden extends BaseAttribute implements IAttribute {

  public readonly oocAbilityName = 'Turn All To Gold';
  public readonly oocAbilityDesc = 'Attract a gold-related event.';
  public readonly oocAbilityCost = 25;

  public oocAbility(player: Player): string {
    const event = player.$$game.rngService.weighted(['BlessGold', 'Merchant', 'Gamble', 'ForsakeGold'], [50, 150, 100, 10]);
    player.$$game.eventManager.doEventFor(player, event);
    return `You've attracted some gold!`;
  }
}
