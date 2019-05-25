import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import * as Discord from 'discord.js';

import { Logger } from '../logger';
import { ChatHelper } from './chat-helper';
import { IMessage } from '../../../shared/interfaces';

@Singleton
@AutoWired
export class DiscordManager {

  @Inject private logger: Logger;
  // @Inject private chatHelper: ChatHelper;

  private discord: Discord.Client;
  private discordGuild: Discord.Guild;
  private discordChannel: Discord.TextChannel;

  private onMessageCallback = (msg: IMessage) => {};

  public async init(onMessageCallback, canServerNodeRunDiscord = true): Promise<void> {
    if(!process.env.DISCORD_SECRET || !canServerNodeRunDiscord) return;

    this.onMessageCallback = onMessageCallback;

    this.discord = new Discord.Client();

    try {
      await this.discord.login(process.env.DISCORD_SECRET);
      this.logger.log('Discord', 'Connected!');
    } catch(e) {
      this.logger.error(`Discord`, e.message);
      return;
    }

    this.discordGuild = this.discord.guilds.get(process.env.DISCORD_GUILD_ID);
    this.discordChannel = <Discord.TextChannel>this.discord.channels.get(process.env.DISCORD_CHANNEL_ID);

    this.discord.on('error', (error) => {
      this.logger.error(new Error(error.message));
    });

    this.discord.on('message', (message) => {
      if(message.channel.id !== this.discordChannel.id || message.author.bot) return;

      this.onMessageCallback({
        fromDiscord: true,
        timestamp: Date.now(),

        playerName: message.member.displayName,
        message: message.content
      });

    });
  }

  public updateUserCount(userCount: number): void {
    if(!this.discordChannel) return;

    this.discordChannel.setTopic(`${userCount} player(s) in game`);
  }

  public sendMessage(message: string): void {
    if(!this.discordChannel) return;

    this.discordChannel.send(message);
  }

}
