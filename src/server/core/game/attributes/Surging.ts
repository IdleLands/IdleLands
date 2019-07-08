import { Player } from '../../../../shared/models/entity';
import { IAttribute } from '../../../../shared/interfaces';
import { BaseAttribute } from '../professions/Profession';

export class Surging extends BaseAttribute implements IAttribute {

  public readonly oocAbilityName = 'Experience Surge';
  public readonly oocAbilityDesc = 'Your pet gains 5% of its max experience.';
  public readonly oocAbilityCost = 25;

  public oocAbility(player: Player): string {
    const xpNeeded = Math.floor(player.$pets.$activePet.xp.maximum / 20);
    const xpGain = player.$pets.$activePet.gainXP(xpNeeded);

    return `Your pet has gained ${xpGain.toLocaleString()} exp!`;
  }
}
