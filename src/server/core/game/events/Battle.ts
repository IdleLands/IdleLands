
import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

export class Battle extends Event {
  public static readonly WEIGHT = 18;

  public operateOn(player: Player) {
    player.$$game.combatHelper.createAndRunCombat(player);
    
    this.emitMessage([player], 'You should be battling right now, but it is not implemented.', AdventureLogEventType.Meta);
  }
}
