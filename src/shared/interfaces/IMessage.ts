
export interface IMessage {
  timestamp?: number;
  message: string;

  playerName: string;
  realPlayerName?: string;
  playerLevel?: number;
  playerAscension?: number;

  fromDiscord?: boolean;
}
