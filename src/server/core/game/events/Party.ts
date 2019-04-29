
import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

// TODO: party https://github.com/IdleLands/IdleLands/blob/master/src/plugins/events/events/Party.js
export class Party extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player) {
    this.emitMessage([player], 'You should be getting a party, but it is not implemented.', AdventureLogEventType.Meta);
  }
}
