
import { includes } from 'lodash';

import { ServerEventName, ServerEvent } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class ChangeGenderEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterGender;
  description = 'Change your characters gender.';
  args = 'newGender';

  async callback({ newGender } = { newGender: '' }) {
    const player = this.player;
    const possibleGenders = player.availableGenders;

    if(!includes(possibleGenders, newGender)) return this.gameError('Invalid gender specified');

    player.gender = newGender;
    this.game.updatePlayer(player);
    this.gameSuccess(`Gender is now "${newGender}"`);
  }
}

export class ChangeTitleEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterTitle;
  description = 'Change your characters title.';
  args = 'newTitle';

  async callback({ newTitle } = { newTitle: '' }) {
    const player = this.player;
    const possibleTitles = player.availableTitles;

    if(!newTitle) {
      player.title = '';
      this.game.updatePlayer(player);
      this.gameSuccess(`Title is now unset.`);
      return;
    }

    if(!includes(possibleTitles, newTitle)) return this.gameError('Invalid title specified');

    player.title = newTitle;
    this.game.updatePlayer(player);
    this.gameSuccess(`Title is now "${newTitle}"`);
  }
}
