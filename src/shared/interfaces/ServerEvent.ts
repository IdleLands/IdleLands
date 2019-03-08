
export enum ServerEventName {
  GameMessage = 'gamemessage',

  AuthSignIn = 'auth:signin',
  AuthSignOut = 'auth:signout',
  AuthRegister = 'auth:register',
  AuthNeedsName = 'auth:needsname',
  PlayGame = 'auth:playgame',

  CharacterSync = 'character:sync'
}

export interface ServerEvent {
  event: string;
  description: string;
  args: string;

  callback: (args) => void;
}
