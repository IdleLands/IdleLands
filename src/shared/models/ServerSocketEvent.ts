import { ServerEventName } from '../interfaces';
import { Game } from '../../server/core/game/game';

export class ServerSocketEvent {

  protected emit(event: ServerEventName, data: any) {
    this.socket.emit('gameevent', { name: event, data });
  }

  protected gameError(err: string) {
    this.emit(ServerEventName.GameMessage, { message: err, type: 'error' });
  }

  constructor(protected game: Game, private socket) {}
}
