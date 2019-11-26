
export interface IMessage {
  timestamp?: number;
  message: string;

  playerName: string;
  guildTag: string;
  realPlayerName?: string;
  playerLevel?: number;
  playerAscension?: number;

  fromDiscord?: boolean;
}
