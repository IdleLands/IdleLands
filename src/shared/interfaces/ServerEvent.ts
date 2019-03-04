
export enum ServerEventName {
  AuthSignIn = 'auth:signin'
}

export interface ServerEvent {
  event: string;
  description: string;
  args: string;

  callback: () => void;
}
