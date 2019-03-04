
export enum ServerEventName {
  GameMessage = 'gamemessage',

  AuthSignIn = 'auth:signin'
}

export interface ServerEvent {
  event: string;
  description: string;
  args: string;

  callback: () => void;
}
