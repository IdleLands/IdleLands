import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import * as Discord from 'discord.js';

import { Logger } from '../logger';
import { IMessage } from '../../../shared/interfaces';

@Singleton
@AutoWired
export class DiscordManager {

  @Inject private logger: Logger;

  private discord: Discord.Client;
  private discordGuild: Discord.Guild;
  private discordChannel: Discord.TextChannel;

  private onMessageCallback = (msg: IMessage) => { };

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

      let content = message.cleanContent;
      if(!content) {
        const attachment = message.attachments.first();
        if(attachment) {
          content = attachment.url;
        }
      }

      if(!content) return;

      this.onMessageCallback({
        fromDiscord: true,
        timestamp: Date.now(),

        playerName: message.member ? message.member.displayName : 'UNKNOWN',
        message: content
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

  public discordUserWithTag(tag: string) {
    if(!this.discordChannel) return null;
    return this.discord.users.find(u => `${u.username}#${u.discriminator}` === tag);
  }

  public isTagInDiscord(tag: string): boolean {
    if(!this.discordChannel) return false;
    return !!this.discordUserWithTag(tag);
  }

  public hasRole(tag: string, role: string): boolean {
    const roles = this.getUserRoles(tag);
    if(!roles) return false;
    return !!roles.find(r => r.name === role);
  }

  public getUserRoles(tag: string) {
    if(!this.discordGuild) return null;
    const guildUser = this.discordGuild.members.find(u => `${u.user.username}#${u.user.discriminator}` === tag);
    if(!guildUser) return null;
    return guildUser.roles;
  }

  public submitCustomItem(fromPlayer: string, itemText: string) {
    if(!this.discordGuild) return null;

    const discordChannel = process.env.DISCORD_CUSTOM_ITEM_CHANNEL_ID;
    if(!discordChannel) return null;

    const channelRef = <Discord.TextChannel>this.discord.channels.get(process.env.DISCORD_CUSTOM_ITEM_CHANNEL_ID);
    if(!channelRef) return null;

    channelRef.send(`Via ${fromPlayer}: ${itemText}`);
  }

}
