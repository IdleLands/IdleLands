
import { Event, EventMessageType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, ICombat } from '../../../../shared/interfaces';

export class BattlePvP extends Event {
  public static readonly WEIGHT = 18;

  public operateOn(player: Player) {

    const checkPlayers = this.playerManager.allPlayers.filter(
      x => (player.$party ? x.$party : !x.$party)
        && (player.$party ? x.$party.name !== player.$party.name : true)
        && x !== player
    );

    if(checkPlayers.length < 1) {
      this.emitMessage([player], 'You almost found a sparring partner!', AdventureLogEventType.Party);
      return;
    }

    const chosenTarget = checkPlayers[0];

    const allPlayers = [];
    allPlayers.push(...(player.$party ? player.$party.members : [player.name]));
    allPlayers.push(...(chosenTarget.$party ? chosenTarget.$party.members : [chosenTarget.name]));

    if(!player.$$game.combatHelper.canDoCombat(player) || !player.$$game.combatHelper.canDoCombat(chosenTarget)) {
      this.emitMessageToNames(allPlayers,
        'Someone is too injured to fight!',
        AdventureLogEventType.Combat);
      return;
    }

    const combatInst: ICombat = player.$$game.combatHelper.createAndRunPvPCombat(player, chosenTarget);

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
