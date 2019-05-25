
export interface IMessage {
  timestamp: number;
  message: string;

  playerName: string;
  playerLevel?: number;
  playerAscension?: number;

  fromDiscord?: boolean;
}
