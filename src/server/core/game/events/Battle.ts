
import { Event, EventMessageType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, ICombat } from '../../../../shared/interfaces';

export class Battle extends Event {
  public static readonly WEIGHT = 18;

  public operateOn(player: Player) {
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

    this.emitMessage([player], allText, AdventureLogEventType.Combat, { combatString: emitString });
  }
}
