import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

// TODO: find treasure event
export class FindTreasure extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player) {
    // opts.treasureName
    this.emitMessage([player], 'You should be finding a treasure right now, but it is not implemented.', AdventureLogEventType.Meta);
  }
}
