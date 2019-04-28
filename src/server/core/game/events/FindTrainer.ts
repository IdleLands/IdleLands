import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

// TODO: find trainer event
export class FindTrainer extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player) {
    // opts.professionName, opts.trainerName
    this.emitMessage([player], 'You should be finding a trainer right now, but it is not implemented.', AdventureLogEventType.Meta);
  }
}
