import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { Player } from '../../../shared/models/entity';
import { RNGService } from './rng-service';

import * as Events from '../game/events';
import { Choice } from '../../../shared/models';
import { PlayerManager } from './player-manager';
import { ServerEventName } from '../../../shared/interfaces';
import { Logger } from '../logger';

const EVENT_TICKS = process.env.NODE_ENV === 'production' ? { min: 25, max: 35 } : { min: 3, max: 5 };

@Singleton
@AutoWired
export class EventManager {

  @Inject private rng: RNGService;
  @Inject private playerManager: PlayerManager;
  @Inject private logger: Logger;

  public tryToDoEventFor(player: Player) {
    if(player.eventSteps > 0) {
      player.eventSteps--;
      return;
    }

    player.eventSteps = this.rng.chance.integer(EVENT_TICKS);

    const events = Object.keys(Events);
    const weights = events.map(x => Events[x].WEIGHT);

    const chosenEventName = this.rng.chance.weighted(events, weights);

    player.$statistics.increase(`Character.Events`, 1);
    player.$statistics.increase(`Event.${chosenEventName}.Times`, 1);

    this.doEventFor(player, chosenEventName);
  }

  public doEventFor(player: Player, eventName: string) {
    if(!Events[eventName]) {
      this.logger.error(`EventManager`, `Event type ${eventName} is invalid.`);
      return;
    }

    const event = new Events[eventName]();
    event.operateOn(player);
  }

  public successMessage(player: Player, message: string) {
    this.playerManager.emitToPlayer(player.name, ServerEventName.GameMessage, { message, type: 'success' });
  }

  public errorMessage(player: Player, message: string) {
    this.playerManager.emitToPlayer(player.name, ServerEventName.GameMessage, { message, type: 'danger' });
  }

  public doChoiceFor(player: Player, choice: Choice, decision: string): boolean {
    const event = new Events[choice.event]();
    return event.doChoice(player, choice, decision);
  }
}
