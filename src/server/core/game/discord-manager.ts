import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import * as Discord from 'discord.js';

import { Logger } from '../logger';

@Singleton
@AutoWired
export class DiscordManager {

  @Inject private logger: Logger;

  private discord: Discord.Client;
  private discordGuild: Discord.Guild;
  private discordChannel: Discord.GuildChannel;

  public async init(): Promise<void> {
    if(!process.env.DISCORD_SECRET) return;

    this.discord = new Discord.Client();

    try {
      await this.discord.login(process.env.DISCORD_SECRET);
    } catch(e) {
      this.logger.error(`Discord`, e.message);
      return;
    }

    this.discordGuild = this.discord.guilds.get(process.env.DISCORD_GUILD_ID);
    this.discordChannel = <Discord.GuildChannel>this.discord.channels.get(process.env.DISCORD_CHANNEL_ID);

    this.discord.on('error', (error) => {
      this.logger.error(error);
    });
  }

  public updateUserCount(userCount: number): void {
    if(!this.discordChannel) return;

    this.discordChannel.setTopic(`${userCount} player(s) in game`);
  }

  // INCOMING message format
  /*
  <web:${msgData.playerName}
  [${msgData.guildTag || 'no guild'}]
  [${msgData.title || 'no title'}]
  [${msgData.ascensionLevel}~${msgData.level}]>
  ${msgData.text}`;
  */

}
