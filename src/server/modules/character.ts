
import { includes } from 'lodash';

import { ServerEventName, ServerEvent } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class ChangeGenderEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterGender;
  description = 'Change your characters gender.';
  args = 'newGender';

  async callback({ newGender } = { newGender: '' }) {
    const player = this.player;
    const possibleGenders = player.$possibleGenders;

    if(!includes(possibleGenders, newGender)) return this.gameError('Invalid gender specified');

    player.gender = newGender;
    this.gameSuccess(`Gender is now "${newGender}"`);
  }
}
