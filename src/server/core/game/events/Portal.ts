import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { Choice } from '../../../../shared/models';

export class Portal extends Event {
  public static readonly WEIGHT = 3;

  public doChoice(eventManager: any, player: Player, choice: Choice, valueChosen: string): boolean {
    if(valueChosen === 'No') return true;
    const location = choice.extraData.location;

    player.$$game.movementHelper.doTeleport(player, location);
    return true;
  }

  public operateOn(player: Player) {
    const teleports = this.assetManager.allTeleports;
    const possibleLocations = [
      teleports['Astral Town'],
      teleports['Frigri Town'],
      teleports['Homlet Town'],
      teleports['Maeles Town'],
      teleports['Norkos Town'],
      teleports['Raburro Town'],
      teleports['Vocalnus Town'],
      teleports['Tree Town'],
      teleports['Astral Control Room'],
      teleports['fatepools'],
      teleports['fatelake'],
      teleports['Hi 2 U'],
      teleports['hallofheroes'],
      teleports['dChickenproblemsolver'],
      teleports['funhouse'],
      teleports['idleisland'],
      teleports['maelespark'],
      teleports['cabrandungeon'],
      teleports['start'],
      teleports['desert']
    ];

    const location = this.rng.pickone(possibleLocations);

    const locationString = location.formalName || location.map;
    const choice = this.getChoice({
      desc: `
        A fairy has offered you a portal. Would you like to travel to ${locationString}?
      `,
      choices: ['Yes', 'No'],
      defaultChoice: player.getDefaultChoice(['Yes', 'No']),
      extraData: { location }
    });

    player.$choices.addChoice(player, choice);
  }
}
