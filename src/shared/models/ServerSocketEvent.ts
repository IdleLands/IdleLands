import { ServerEventName, IPlayer } from '../interfaces';
import { Game } from '../../server/core/game/game';

export class ServerSocketEvent {

  protected get player(): string {
    return this.socket.playerName;
  }

  protected emit(event: ServerEventName, data: any = {}) {
    this.socket.emit('gameevent', { name: event, data });
  }

  protected gameSuccess(err: string) {
    this.emit(ServerEventName.GameMessage, { message: err, type: 'success' });
  }

  protected gameError(err: string) {
    this.emit(ServerEventName.GameMessage, { message: err, type: 'danger' });
  }

  protected gameWarning(err: string) {
    this.emit(ServerEventName.GameMessage, { message: err, type: 'warning' });
  }

  protected gameMessage(err: string) {
    this.emit(ServerEventName.GameMessage, { message: err });
  }

  protected setPlayer(player: IPlayer) {
    this.socket.playerName = player.name;
  }

  constructor(protected game: Game, private socket) {}
}
