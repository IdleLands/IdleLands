import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { Player } from '../../../shared/models/entity';
import { RNGService } from './rng-service';

import * as Events from '../game/events';
import { Choice } from '../../../shared/models';

const EVENT_TICKS = process.env.NODE_ENV === 'production' ? { min: 25, max: 35 } : { min: 3, max: 5 };

@Singleton
@AutoWired
export class EventManager {

  @Inject private rng: RNGService;

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

    const event = new Events[chosenEventName]();
    event.operateOn(player);
  }

  public doChoiceFor(player: Player, choice: Choice, decision: string) {
    Events[choice.event].doChoice(player, choice, decision);
  }
}
