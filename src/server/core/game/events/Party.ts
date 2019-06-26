
import { Event, EventType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

export class Party extends Event {
  public static readonly WEIGHT = 9;

  public operateOn(player: Player) {
    if(player.$personalities.isActive('Solo')) {
      this.emitMessage([player],
        'You almost started looking for a party before you realized you did not want one!', AdventureLogEventType.Party);
      return;
    }

    if(player.$party) {
      this.emitMessage([player],
        'You almost started looking for a party before you realized you were in one!', AdventureLogEventType.Party);
      return;
    }

   /* TODO: this does not work cross server.
            to do so, fullname() needs to be stubbed or queried, and solo/camper need to be sent or queried
   */
   const checkPlayers = this.playerManager.allPlayers.filter(
         x => !x.$party
      && x !== player
      && !x.$personalities.isActive('Solo')
      && !x.$personalities.isActive('Camper')
    );
    if(checkPlayers.length < 3) {
      this.emitMessage([player], 'You almost found enough people for a group!', AdventureLogEventType.Party);
      return;
    }

    const newParty = this.partyHelper.createParty();
    const chosenPlayers = this.rng.picksome<Player>(checkPlayers, 3);

    player.increaseStatistic(`Event/Party/Create`, 1);

    const allMembers = [player, ...chosenPlayers];
    allMembers.forEach(joinPlayer => {
      this.partyHelper.playerJoin(newParty, joinPlayer);
    });

    this.partyHelper.shareParty(newParty);

    const partyMemberString = chosenPlayers.map(p => `«${p.fullName()}»`).join(', ');

    const eventText = this.eventText(EventType.Party, player,
      { partyName: newParty.name, partyMembers: partyMemberString });
    this.emitMessage([player], eventText, AdventureLogEventType.Party);
  }
}
