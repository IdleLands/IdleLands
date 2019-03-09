
import * as uuid from 'uuid/v4';

import { ServerEvent, ServerEventName } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class SignInEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthSignIn;
  description = 'Sign in to IdleLands anonymously.';
  args = 'userId';

  async callback({ userId, authToken } = { userId: '', authToken: '' }) {
    if(!userId && !authToken) return this.gameError(`${this.event} requires a userId or an authToken.`);

    let searchOpts: any = { currentUserId: userId };

    // we check for an auth id first because if a token is specified, we need to look for that
    if(authToken) {
      try {
        const decodedToken = await this.game.databaseManager.verifyToken(authToken);
        searchOpts = { authId: decodedToken.uid };
      } catch(e) {
        this.gameError('Auth token could not be decoded correctly.');
        return;
      }
    }

    const character = await this.game.databaseManager.checkIfPlayerExists(searchOpts);

    if(!character) {
      this.emit(ServerEventName.AuthNeedsName, {});
      return;
    }

    const loggedInPlayer = this.game.playerManager.getPlayer(character.name);

    if(loggedInPlayer) {
      character.sessionId = loggedInPlayer.sessionId;
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
    let character = await this.game.databaseManager.checkIfPlayerExists({ currentUserId: userId, name });

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

export class SyncAccountEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthSyncAccount;
  description = 'Lock your account down using a non-anonymous method.';
  args = '';

  async callback({ token } = { token: '' }) {

    if(!token) return this.gameError('You need to specify a token.');
    if(!this.player) return this.gameError('You do not have a player associated with this socket. Try to sync again later.');

    const loggedInPlayer = this.game.playerManager.getPlayer(this.player);
    if(!loggedInPlayer) return this.gameError('Not currently logged in anywhere.');

    let setKey = false;
    try {
      setKey = await this.game.databaseManager.setAuthKey(loggedInPlayer, token);
    } catch(e) {
      this.gameError(e.message);
    }

    if(setKey) {
      this.emit(ServerEventName.CharacterSync, loggedInPlayer);
    }
  }
}

export class UnsyncAccountEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthUnsyncAccount;
  description = 'Remove your synced account information.';
  args = '';

  async callback({ token } = { token: '' }) {

    if(!token) return this.gameError('You need to specify a token.');
    if(!this.player) return this.gameError('You do not have a player associated with this socket. Try to sync again later.');

    const loggedInPlayer = this.game.playerManager.getPlayer(this.player);
    if(!loggedInPlayer) return this.gameError('Not currently logged in anywhere.');

    let setKey = false;
    try {
      setKey = await this.game.databaseManager.setAuthKey(loggedInPlayer, token, true);
    } catch(e) {
      this.gameError(e.message);
    }

    if(setKey) {
      this.emit(ServerEventName.CharacterSync, loggedInPlayer);
    }
  }
}

export class PlayGameEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PlayGame;
  description = 'Join the game!';
  args = 'userId, sessionId, authToken, relogin';

  async callback({ userId, sessionId, authToken, relogin } = { userId: '', sessionId: '', authToken: '', relogin: false }) {
    if(!userId && !authToken) return this.gameError(`${this.event} requires a userId or an authToken.`);

    let searchOpts: any = { currentUserId: userId };

    // we check for an auth id first because if a token is specified, we need to look for that
    if(authToken) {
      try {
        const decodedToken = await this.game.databaseManager.verifyToken(authToken);
        searchOpts = { authId: decodedToken.uid };
      } catch(e) {
        this.gameError('Auth token could not be decoded correctly.');
        return;
      }
    }

    const characterCheck = await this.game.databaseManager.checkIfPlayerExists(searchOpts);
    if(!characterCheck) return;

    const loggedInPlayer = this.game.playerManager.getPlayer(characterCheck.name);

    // check first the logged in player to see if it exists, and if we match
    if(loggedInPlayer && loggedInPlayer.loggedIn && sessionId !== loggedInPlayer.sessionId) {
      return this.gameError('Unable to log in, please wait 30 seconds and try again.');
    }

    // thirdly, check the character to see if it is logged in (fallback)
    if(!loggedInPlayer && characterCheck.loggedIn) {
      return this.gameError('You are already logged in elsewhere.');
    }

    if(!characterCheck) return this.gameError('Your character does not exist.');

    // we have passed all of the checks, so lets hit the database again, why not?
    const character = await this.game.databaseManager.loadPlayer(searchOpts);

    if(!relogin) this.gameSuccess(`Welcome back, ${character.name}!`);

    character.sessionId = uuid();

    // if we have an auth token, or we have a current user id, we can change to a new user id
    if(authToken && userId) {
      character.currentUserId = userId;
    }

    this.setPlayer(character);
    this.game.playerManager.addPlayer(character);
    this.game.databaseManager.savePlayer(character);

    this.emit(ServerEventName.CharacterSync, character);
    this.emit(ServerEventName.PlayGame);
  }
}
