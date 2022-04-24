
import * as uuid from 'uuid/v4';
import { isString } from 'lodash';

import { censorSensor } from '../core/static/profanity-filter';

import { ServerEvent, ServerEventName } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class SignInEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthSignIn;
  description = 'Sign in to IdleLands anonymously.';
  args = 'userId';

  async callback({ userId, authToken } = { userId: '', authToken: '' }) {
    // if(this.playerName) return this.gameError('You are already connected!');
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
      this.emit(ServerEventName.AuthNeedsName, { });
      return;
    }

    const loggedInPlayer = this.game.playerManager.getPlayer(character.name);

    if(loggedInPlayer) {
      character.sessionId = loggedInPlayer.sessionId;
    }

    this.emit(ServerEventName.CharacterSync, loggedInPlayer || character);
  }
}

export class SignOutEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthSignOut;
  description = 'Sign out of IdleLands.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    player.loggedIn = false;
    player.lastOnline = Date.now();
    this.game.databaseManager.savePlayer(player);
    this.game.playerManager.removePlayer(player);

    this.setPlayer(null);

    this.gameMessage('Come back and idle any time!');
  }
}

export class DeleteEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthDelete;
  description = 'Delete your IdleLands character.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.authId) return this.gameError('Please unsync before you delete your character!');

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
    if(this.playerName) return this.gameError('You are already connected!');
    if(!userId || !name) return this.gameError(`${this.event} requires a userId and a name.`);
    if(name.length < 2 || name.length > 20) return this.gameError(`Character name must be between 2 and 20 characters.`);
    if(censorSensor.isProfaneIsh(name)) return this.gameError(`Character name is a bit too crude.`);

    // try to load a character with this id/name
    let character = await this.game.databaseManager.checkIfPlayerExists({ currentUserId: userId, name });

    // Check if that IP is banned
    const banned = await this.game.databaseManager.checkForIPBan(this.socketAddress());
    if(banned && banned.ips.length > 0) {
      console.log(`Ban matched user: ${banned.name}(${banned._id})`);
      return this.gameError('You have been permanently banned.');
    }

    if(!character) {

      // if one is not found, try to load the character with just the name - dupe name checking
      const checkCharacter = await this.game.databaseManager.checkIfPlayerExists({ name });
      if(checkCharacter) return this.gameError('Someone has already registered a character with that name.');

      const checkCharacterId = await this.game.databaseManager.checkIfPlayerExists({ userId });
      if(checkCharacterId) {
        return this.gameError(`Seems like you already have a character registered to that id.
        To re-use your current id you need to delete your current character.
        If you want to have multiple simultaneous characters you need to use different devices.`);
      }

      // if there is no one by that name, create a player
      character = await this.game.databaseManager.createPlayer(this.game, name, userId);

      this.game.chatHelper.sendMessageFromClient({
        message: `Welcome ${name} to IdleLands!`,
        playerName: '☆System'
      });
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

    const loggedInPlayer = this.player;
    if(!loggedInPlayer) return this.gameError('Not currently logged in anywhere.');

    let setKey: string|boolean = false;
    try {
      setKey = await this.game.databaseManager.setAuthKey(loggedInPlayer, token);

      if(isString(setKey)) return this.gameError(setKey);
    } catch(e) {
      this.gameError(e.message);
    }

    if(setKey === true) {
      this.game.updatePlayer(loggedInPlayer);
    }
  }
}

export class UnsyncAccountEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthUnsyncAccount;
  description = 'Remove your synced account information.';
  args = '';

  async callback() {

    const loggedInPlayer = this.player;
    if(!loggedInPlayer) return this.gameError('Not currently logged in anywhere.');

    let setKey: string|boolean = false;
    try {
      setKey = await this.game.databaseManager.setAuthKey(loggedInPlayer, '', true);

      if(isString(setKey)) return this.gameError(setKey);
    } catch(e) {
      this.gameError(e.message);
    }

    if(setKey) {
      this.game.updatePlayer(loggedInPlayer);
    }
  }
}

export class PlayGameEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.PlayGame;
  description = 'Join the game!';
  args = 'userId, sessionId, authToken, relogin';

  async callback({ userId, sessionId, authToken, relogin } = { userId: '', sessionId: '', authToken: '', relogin: false }) {

    const playerNumber = this.game.playerManager.allPlayers.length + 1;
    const maskedId = userId.substring(0,8);

    if(this.playerName) {
      const timerName = `Check Player #${playerNumber}: ${maskedId}`;
      this.game.logger.log('Auth', timerName);
      // this.timer.startTimer(timerName);
      const characterPreObj = this.game.playerManager.getPlayer(this.playerName);
      this.emit(ServerEventName.CharacterSync, characterPreObj);
      this.emit(ServerEventName.PlayGame);
      // this.timer.stopTimer(timerName);

      return this.gameError('You are already connected!');
    }

    if(!userId && !authToken) return this.gameError(`${this.event} requires a userId or an authToken.`);

    let searchOpts: any = { currentUserId: userId };

    // we check for an auth id first because if a token is specified, we need to look for that
    if(authToken) {
      try {
        const timerName = `Verify Token #${playerNumber}: ${maskedId}`;
        this.game.logger.log('Auth', timerName);
        // this.timer.startTimer(timerName);
        const decodedToken = await this.game.databaseManager.verifyToken(authToken);
        searchOpts = { authId: decodedToken.uid };
        // this.timer.stopTimer(timerName);
      } catch(e) {
        this.gameError('Auth token could not be decoded correctly.');
        return;
      }
    }

    const checkTimerName = `Check Character #${playerNumber}: ${maskedId}`;
    this.game.logger.log('Auth', checkTimerName);
    // this.timer.startTimer(checkTimerName);
    const characterCheck = await this.game.databaseManager.checkIfPlayerExists(searchOpts);
    // this.timer.stopTimer(checkTimerName);
    if(!characterCheck) {
      if(userId && relogin && !sessionId) return;
      return this.gameError('Your character does not exist.');
    }

    const checkLoggedInTimerName = `Check Logged In Character #${playerNumber}: ${maskedId}`;
    this.game.logger.log('Auth', checkLoggedInTimerName);
    // this.timer.startTimer(checkLoggedInTimerName);
    const loggedInPlayer = this.game.playerManager.getPlayer(characterCheck.name);
    const loggedInFromAnotherServerPlayer = this.game.playerManager.getSimplePlayer(characterCheck.name);
    // this.timer.stopTimer(checkLoggedInTimerName);

    // check first the logged in player to see if it exists, and if we match
    if(loggedInPlayer && loggedInPlayer.loggedIn && sessionId !== loggedInPlayer.sessionId) {
      return this.gameError('Unable to log in, please wait 30 seconds and try again.');
    }

    // thirdly, check the character to see if it is logged in (fallback)
    if(!loggedInPlayer && loggedInFromAnotherServerPlayer && characterCheck.loggedIn) {
      return this.gameError('You are already logged in elsewhere.');
    }

    // we have passed all of the checks, so lets hit the database again, why not?
    const loadTimerName = `Load Character #${playerNumber}: ${maskedId}`;
    this.game.logger.log('Auth', loadTimerName);
    // this.timer.startTimer(loadTimerName);
    const character = await this.game.databaseManager.loadPlayer(this.game, searchOpts);
    // this.timer.stopTimer(loadTimerName);
    if(!character) return this.gameError('Your player could not be loaded for some reason.');

    // Check if that IP is banned
    const banTimerCheckName = `Ban Check #${playerNumber}: ${maskedId}`;
    this.game.logger.log('Auth', banTimerCheckName);
    // this.timer.startTimer(banTimerCheckName);
    const banned = await this.game.databaseManager.checkForIPBan(this.socketAddress());
    // this.timer.stopTimer(banTimerCheckName);
    if(banned && banned.ips.length > 0) {
      console.log(`Ban matched user: ${banned.name} (${banned._id})`);
      return this.gameError('You have been permanently banned.');
    }

    if(!relogin) this.gameSuccess(`Welcome back, ${character.name}!`);

    character.sessionId = uuid();

    // if we have an auth token, or we have a current user id, we can change to a new user id
    if(authToken && userId) {
      character.currentUserId = userId;
    }

    const setCharacter = loggedInPlayer || character;

    const finalizeCheckName = `Finalize #${playerNumber}: ${maskedId}`;
    this.game.logger.log('Auth', finalizeCheckName);
    // this.timer.startTimer(finalizeCheckName);
    this.game.playerManager.addPlayer(setCharacter, this);
    this.setPlayer(setCharacter);
    this.game.databaseManager.savePlayer(setCharacter);

    this.emit(ServerEventName.CharacterSync, setCharacter);
    this.emit(ServerEventName.PlayGame);
    // this.timer.stopTimer(finalizeCheckName);

    this.game.logger.log('Auth', `Try to do new character #${playerNumber}: ${maskedId} (${character.name})`);
    setTimeout(() => {
      setCharacter.tryToDoNewCharacter();
    }, 500);
  }
}
