
import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, ICombat, EventMessageType } from '../../../../shared/interfaces';

export class Battle extends Event {
  public static readonly WEIGHT = 9;

  public operateOn(player: Player) {

    const allPlayers = player.$party ? player.$party.members : [player.name];

    if(!player.$$game.combatHelper.canDoCombat(player)) {
      this.emitMessageToNames(allPlayers,
        'Someone in your party is too injured to fight!',
        AdventureLogEventType.Combat);
      return;
    }

    const combatInst: ICombat = player.$$game.combatHelper.createAndRunMonsterCombat(player);

    const emitString = player.$$game.combatHelper.getCompressedCombat(combatInst);

    const displayPartyFormat = [];
    Object.values(combatInst.parties).forEach(({ id, name }) => {
      const partyObj = { name, players: [] };
      Object.values(combatInst.characters).forEach(member => {
        if(member.combatPartyId !== id) return;
        partyObj.players.push(member.name);
      });

      displayPartyFormat.push(partyObj);
    });

    const eventText = this.eventText(EventMessageType.Battle, player, { _eventData: { parties: displayPartyFormat } });
    const allText = `${eventText}`;

    this.emitMessageToNames(allPlayers, allText, AdventureLogEventType.Combat, { combatString: emitString });
  }
}
