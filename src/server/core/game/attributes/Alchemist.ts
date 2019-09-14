import { Player } from '../../../../shared/models/entity';
import { IAttribute } from '../../../../shared/interfaces';
import { BaseAttribute } from '../professions/Profession';

export class Alchemist extends BaseAttribute implements IAttribute {

  public readonly oocAbilityName = 'Alchemize';
  public readonly oocAbilityDesc = 'Sometimes converts pet XP to GOLD and vice-versa.';
  public readonly oocAbilityCost = 25;

  public oocAbility(player: Player): { success: boolean, message: string } {

    const shouldTakeXP = player.$$game.rngService.likelihood(50);
    if(shouldTakeXP) {
      const maxXPTaken = player.$pets.$activePet.gold.maximum;
      const xpTaken = Math.min(maxXPTaken, player.$pets.$activePet.xp.total);

      if(xpTaken === 0) return { success: false, message: 'The experiment was a failure; there is no experience to be taken.' };

      player.$pets.$activePet.gainXP(-xpTaken, false);
      player.$pets.$activePet.gainGold(xpTaken, false);

      return { success: true, message: `Your pet has gained ${xpTaken.toLocaleString()} gold!` };
    }

    const goldTaken = player.$pets.$activePet.gold.total;
    player.$pets.$activePet.gainXP(Math.floor(Math.sqrt(goldTaken)), false);
    player.$pets.$activePet.gainGold(-goldTaken, false);

    if(goldTaken === 0) return { success: false, message: 'The experiment was a failure; there is no gold to be taken.' };

    return { success: true, message: `Your pet has gained ${Math.floor(Math.sqrt(goldTaken)).toLocaleString()} exp!` };
  }
}
