
import { includes } from 'lodash';

import { ServerEventName, ServerEvent } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class ChangeGenderEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterGender;
  description = 'Change your characters gender.';
  args = 'newGender';

  async callback({ newGender } = { newGender: '' }) {
    const player = this.player;
    if(!player) return this.gameError('Your socket is not currently connected to a player.');
    
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
    if(!player) return this.gameError('Your socket is not currently connected to a player.');

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

export class AscendEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterAscend;
  description = 'Ascend.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.gameError('Your socket is not connected to a player.');
    if(player.canLevelUp()) return this.gameError('You are not currently able to ascend.');

    player.ascend();
    this.game.updatePlayer(player);

    this.gameSuccess(`You have ascended!`);
  }
}
