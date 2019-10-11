import { Player } from '../../../../shared/models/entity';
import { IAttribute } from '../../../../shared/interfaces';
import { BaseAttribute } from '../professions/Profession';

export class Fateful extends BaseAttribute implements IAttribute {

  public readonly oocAbilityName = 'Fatewater Bath';
  public readonly oocAbilityDesc = 'Take a quick bath in a small puddle of Fate Water.';
  public readonly oocAbilityCost = 25;

  public oocAbility(player: Player): { success: boolean, message: string } {
    player.$$game.eventManager.doEventFor(player, 'Providence', { preventClassChange: true });
    return { success: true, message: `You've bathed in your fate!` };
  }
}
