
import { sample } from 'lodash';

import { Player } from '../../../../shared/models/entity';
import { IAttribute } from '../../../../shared/interfaces';
import { BaseAttribute } from '../professions/Profession';

export class Trueseer extends BaseAttribute implements IAttribute {

  public readonly oocAbilityName = 'Teleseer';
  public readonly oocAbilityDesc = 'Teleport to a random town on the Norkos Continent.';
  public readonly oocAbilityCost = 10;

  public oocAbility(player: Player): {success: boolean, message: string} {
    const possibleTowns = ['Norkos', 'Maeles', 'Vocalnus', 'Raburro', 'Homlet', 'Frigri'];
    const town = sample(possibleTowns);

    player.$$game.movementHelper.doTeleport(player, { toLoc: `${town} Town` });

    return {success: true, message: `You teleported to ${town} Town!`};
  }
}
