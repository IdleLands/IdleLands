import { ServerEvent, ServerEventName } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class SignInEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.AuthSignIn;
  description = 'Sign in to IdleLands anonymously.';
  args = 'userId';

  async callback(args) {
    if(!args || !args.userId) return this.gameError(`${this.event} requires a userId`);

    const character = await this.game.databaseManager.loadPlayer(args);

    if(!character) {
      this.emit(ServerEventName.AuthNeedsName, {});
      return;
    }

    this.emit(ServerEventName.CharacterSync, character);
  }
}
