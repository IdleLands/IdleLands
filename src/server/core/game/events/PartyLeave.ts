
import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { Choice } from '../../../../shared/models';

export class PartyLeave extends Event {

  // this is set to 15 if you have a party, but it is default 0 so it doesn't dilute the event pool
  public static readonly WEIGHT = 0;

  public doChoice(eventManager: any, player: Player, choice: Choice, valueChosen: string): boolean {
    if(valueChosen === 'No') return true;

    player.$$game.partyHelper.playerLeave(player);

    return true;
  }

  public operateOn(player: Player) {

    // force the id to be PartyLeave so we can easily find it later, since only one can exist.
    const existingChoice = player.$choices.getChoice('PartyLeave');
    if(existingChoice) return;

    const choice = this.getChoice({
      id: 'PartyLeave',
      desc: `
        Would you like to leave your party?
      `,
      choices: ['Yes', 'No'],
      defaultChoice: player.getDefaultChoice(['Yes', 'No'])
    });

    player.$choices.addChoice(player, choice);
  }
}
