
import * as uuid from 'uuid/v4';

import { ServerEvent, ServerEventName } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class SignInEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthSignIn;
  description = 'Sign in to IdleLands (anonymously or authenticated).';
  args = 'userId';

  async callback({ userId } = { userId: ''}) {

    // TODO: check here for an authId, if present, cannot sign in anonymously (authId takes precedence over userId)
    if(!userId) return this.gameError(`${this.event} requires a userId`);

    const character = await this.game.databaseManager.checkIfPlayerExists({ userId });

    if(!character) {
      this.emit(ServerEventName.AuthNeedsName, {});
      return;
    }

    this.emit(ServerEventName.CharacterSync, character);
  }
}

export class SignOutEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthSignOut;
  description = 'Sign out of IdleLands.';
  args = '';

  async callback() {
    const player = this.game.playerManager.getPlayer(this.player);
    player.loggedIn = false;
    this.game.databaseManager.savePlayer(player);
    this.game.playerManager.removePlayer(player);

    this.gameMessage('Come back and idle any time!');
  }
}

export class DeleteEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthDelete;
  description = 'Delete your IdleLands character.';
  args = '';

  async callback() {
    const player = this.game.playerManager.getPlayer(this.player);
    this.game.databaseManager.deletePlayer(player);
    this.game.playerManager.removePlayer(player);

    this.gameMessage('Goodbye forever :(');
  }
}

export class RegisterEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthRegister;
  description = 'Sign in to IdleLands with a name and a userid.';
  args = 'userId, name';

  async callback({ userId, name } = { userId: '', name: '' }) {
    if(!userId || !name) return this.gameError(`${this.event} requires a userId and a name.`);
    if(name.length < 2 || name.length > 20) return this.gameError(`Character name must be between 2 and 20 characters.`);

    // try to load a character with this id/name
    let character = await this.game.databaseManager.checkIfPlayerExists({ userId, name });

    // TODO: check here for an authId, if present, this character cannot be registered.

    if(!character) {

      // if one is not found, try to load the character with just the name - dupe name checking
      const checkCharacter = await this.game.databaseManager.checkIfPlayerExists({ name });
      if(checkCharacter) return this.gameError('Someone has already registered a character with that name.');

      // if there is no one by that name, create a player
      character = await this.game.databaseManager.createPlayer(name, userId);
    }

    this.emit(ServerEventName.CharacterSync, character);
  }
}

export class PlayGameEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PlayGame;
  description = 'Join the game!';
  args = 'userId, sessionId, relogin';

  async callback({ userId, sessionId, relogin } = { userId: '', sessionId: '', relogin: false }) {
    if(!userId) return this.gameError(`${this.event} requires a userId`);

    const characterCheck = await this.game.databaseManager.checkIfPlayerExists({ userId });
    if(!characterCheck) return;

    const loggedInPlayer = this.game.playerManager.getPlayer(characterCheck.name);

    // check first the logged in player to see if it exists, and if we match
    if(loggedInPlayer && loggedInPlayer.loggedIn && sessionId !== loggedInPlayer.sessionId) {
      return this.gameError('Unable to log in, please wait 30 seconds and try again.');
    }

    // secondly, check the character to see if it is logged in (fallback)
    if(!loggedInPlayer && characterCheck.loggedIn) {
      return this.gameError('You are already logged in elsewhere.');
    }

    // TODO: check here for an authId, if present, cannot sign in anonymously

    if(!characterCheck) return this.gameError('Your character does not exist.');

    // we have passed all of the checks, so lets hit the database again, why not?
    const character = await this.game.databaseManager.loadPlayer({ userId });

    if(!relogin) this.gameSuccess(`Welcome back, ${character.name}!`);

    character.sessionId = uuid();

    this.setPlayer(character);
    this.game.playerManager.addPlayer(character);
    this.game.databaseManager.savePlayer(character);

    this.emit(ServerEventName.CharacterSync, character);
    this.emit(ServerEventName.PlayGame);
  }
}
