
export interface IMessage {
  timestamp?: number;
  message: string;

  playerName: string;
  playerTitle?: string;
  guildTag?: string;
  realPlayerName?: string;
  playerLevel?: number;
  playerAscension?: number;

  fromDiscord?: boolean;
  address?: string;
}
