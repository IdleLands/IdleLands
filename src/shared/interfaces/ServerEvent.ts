
export enum ServerEventName {
  GameMessage = 'gamemessage',

  AuthSignIn = 'auth:signin',
  AuthRegister = 'auth:register',
  AuthNeedsName = 'auth:needsname',

  CharacterSync = 'character:sync'
}

export interface ServerEvent {
  event: string;
  description: string;
  args: string;

  callback: (args) => void;
}
