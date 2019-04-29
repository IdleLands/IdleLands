
import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

// TODO: providence https://github.com/IdleLands/IdleLands/blob/master/src/plugins/events/events/Providence.js
export class Providence extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player) {
    this.emitMessage([player], 'You should be dealing with a nightmare right now, but it is not implemented.', AdventureLogEventType.Meta);
  }
}
