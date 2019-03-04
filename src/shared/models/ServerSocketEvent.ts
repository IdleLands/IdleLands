import { ServerEventName } from '../interfaces';

export class ServerSocketEvent {

  protected gameError(err: string) {
    this.socket.emit(ServerEventName.GameMessage, { message: err, type: 'error' });
  }

  constructor(private socket) {}
}
