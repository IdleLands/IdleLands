
import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

// TODO: battle
export class Battle extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player) {
    this.emitMessage([player], 'You should be battling right now, but it is not implemented.', AdventureLogEventType.Meta);
  }
}
