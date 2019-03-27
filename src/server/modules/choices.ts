import { ServerSocketEvent } from '../../shared/models';
import { ServerEvent, ServerEventName } from '../../shared/interfaces';

export class MakeChoiceEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ChoiceMake;
  description = 'Make a choice.';
  args = 'choiceId, valueChosen';

  async callback({ choiceId, valueChosen } = { choiceId: '', valueChosen: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const choice = player.$choices.getChoice(choiceId);
    if(!choice) return this.gameError('Could not find choice.');

    const foundChoice = choice.choices.indexOf(valueChosen);
    if(foundChoice === -1) return this.gameError('Invalid decision for choice.');

    player.doChoice(choice, foundChoice);

    this.game.updatePlayer(player);
  }
}
