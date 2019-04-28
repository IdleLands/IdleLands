import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

// TODO: battle boss event
export class BattleBoss extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player, opts?: any) {
    // opts.bossName
    this.emitMessage([player], 'You should be battling a boss right now, but it is not implemented.', AdventureLogEventType.Meta);
  }
}
