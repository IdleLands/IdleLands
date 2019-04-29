
import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

// TODO: partyleave https://github.com/IdleLands/IdleLands/blob/master/src/plugins/events/events/PartyLeave.js
export class PartyLeave extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player) {
    this.emitMessage([player], 'You should be leaving a party right now, but it is not implemented.', AdventureLogEventType.Meta);
  }
}
