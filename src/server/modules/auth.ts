import { ServerEvent, ServerEventName } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class SignInEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthSignIn;
  description = 'Sign in to IdleLands (anonymously or authenticated).';
  args = 'userId';

  async callback({ userId } = { userId: ''}) {

    // TODO: check here for an authId, if present, cannot sign in anonymously (authId takes precedence over userId)
    if(!userId) return this.gameError(`${this.event} requires a userId`);

    const character = await this.game.databaseManager.loadPlayer({ userId });

    if(!character) {
      this.emit(ServerEventName.AuthNeedsName, {});
      return;
    }

    this.emit(ServerEventName.CharacterSync, character);
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
    let character = await this.game.databaseManager.loadPlayer({ userId, name });

    // TODO: check here for an authId, if present, this character cannot be registered.

    if(!character) {

      // if one is not found, try to load the character with just the name - dupe name checking
      const checkCharacter = await this.game.databaseManager.loadPlayer({ name });
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
  args = 'userId';

  async callback({ userId } = { userId: ''}) {
    if(!userId) return this.gameError(`${this.event} requires a userId`);

    const character = await this.game.databaseManager.loadPlayer({ userId });

    const loggedInPlayer = this.game.playerManager.getPlayer(character.name);
    if(character.loggedIn || (loggedInPlayer && loggedInPlayer.loggedIn)) return this.gameError('You are already logged in elsewhere.');

    // TODO: check here for an authId, if present, cannot sign in anonymously

    if(!character) return this.gameError('Your character does not exist.');

    this.emit(ServerEventName.PlayGame, {});
    this.setPlayer(character);
    this.game.playerManager.addPlayer(character);
    this.game.databaseManager.savePlayer(character);
  }
}
