
export interface IPlayer {
  createdAt?: number;
  name?: string;
  level?: number;
  profession?: string;
  gender?: string;
  x?: number;
  y?: number;
  map?: string;
  loggedIn?: boolean;

  loop?(): void;
}
