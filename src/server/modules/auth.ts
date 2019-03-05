import { ServerEvent, ServerEventName } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class SignInEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthSignIn;
  description = 'Sign in to IdleLands anonymously.';
  args = 'userId';

  async callback(args) {
    if(!args || !args.userId) return this.gameError(`${this.event} requires a userId`);

    const character = await this.game.databaseManager.loadPlayer(args);

    // TODO check here for an authId, if present, cannot sign in anonymously

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

  async callback(args) {
    if(!args || !args.userId || !args.name) return this.gameError(`${this.event} requires a userId and a name.`);
    if(args.name.length < 2 || args.name.length > 20) return this.gameError(`Character name must be between 2 and 20 characters.`);

    // try to load a character with this id/name
    let character = await this.game.databaseManager.loadPlayer(args);

    // TODO check here for an authId, if present, this character cannot be registered.


    if(!character) {

      // if one is not found, try to load the character with just the name - dupe name checking
      const checkCharacter = await this.game.databaseManager.loadPlayer({ name: args.name });
      if(checkCharacter) return this.gameError('Someone has already registered a character with that name.');

      // if there is no one by that name, create a player
      character = await this.game.databaseManager.createPlayer(args.name, args.userId);
    }

    this.emit(ServerEventName.CharacterSync, character);
  }
}
