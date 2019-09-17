import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import * as Discord from 'discord.js';

import { Logger } from '../logger';
import { IMessage, GuildMemberTier } from '../../../shared/interfaces';
import { Guild, Player } from '../../../shared/models';
import { c } from 'tar';

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
      const attachment = message.attachments.first();
      if(attachment) {
        content = `${content} ${attachment.url}`.trim();
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

  public discordUserWithTag(tag: string): Discord.GuildMember {
    if(!this.discordChannel) return null;
    return this.discordGuild.members.find(u => `${u.user.username}#${u.user.discriminator}` === tag);
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

  public async removeGuildRole(player: Player) {
    if(!this.discordGuild || !player.discordTag || !player.guildName) return;

    const user = this.discordUserWithTag(player.discordTag);
    this.discordGuild.roles.forEach(x => {
      if(!x.name.includes('Guild:')) return;
      user.removeRole(x);
    });

    const guildModRole = this.discordGuild.roles.find(x => x.name === 'Guild Mod');
    if(guildModRole) {
      user.removeRole(guildModRole);
    }
  }

  public async addGuildRole(player: Player) {
    if(!this.discordGuild || !player.discordTag || !player.guildName) return;

    const user = this.discordUserWithTag(player.discordTag);

    const guildRole = this.discordGuild.roles.find(x => x.name === `Guild: ${player.guildName}`);
    if(guildRole && !user.roles.has(guildRole.id)) {
      await user.addRole(guildRole);
    }

    const guild = player.$$game.guildManager.getGuildForPlayer(player);
    const guildModRole = this.discordGuild.roles.find(x => x.name === 'Guild Mod');
    if(guildModRole && guild && guild.members[player.name] >= GuildMemberTier.Moderator) {
      user.addRole(guildModRole);
    }
  }

  public async removeAllRoles(player: Player) {
    if(!this.discordGuild || !player.discordTag) return;

    const user = this.discordUserWithTag(player.discordTag);
    const verified = this.discordGuild.roles.find(x => x.name === 'Verified');
    if(verified) {
      user.removeRole(verified);
    }

    this.removeGuildRole(player);
  }

  public async checkUserRoles(player: Player) {
    if(!this.discordGuild || !player.discordTag) return;

    const user = this.discordUserWithTag(player.discordTag);

    const verified = this.discordGuild.roles.find(x => x.name === 'Verified');
    if(verified && !user.roles.has(verified.id)) {
      await user.addRole(verified);
    }

    this.addGuildRole(player);
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

  public async createDiscordChannelForGuild(guild: Guild) {
    if(!this.discordGuild) return null;

    const guildModRole = this.discordGuild.roles.find(x => x.name === 'Guild Mod');

    let role = this.discordGuild.roles.find(x => x.name === `Guild: ${guild.name}`);
    if(!role) {
      role = await this.discordGuild.createRole({ name: `Guild: ${guild.name}`});
    }

    let channel = this.discordGuild.channels.find(x => x.name === guild.name.split(' ').join('-').toLowerCase());
    if(!channel) {
      channel = await this.discordGuild.createChannel(guild.name, 'text');
    }

    const categoryId = process.env.DISCORD_GUILD_CHANNEL_GROUP_ID;
    await channel.setParent(categoryId);

    await channel.overwritePermissions(this.discord.user.id, {
      VIEW_CHANNEL: true
    });

    await channel.overwritePermissions(guildModRole, {
      MANAGE_MESSAGES: true
    });

    await channel.overwritePermissions(role, {
      VIEW_CHANNEL: true
    });

    await channel;

    await channel.overwritePermissions(this.discordGuild.id, {
      VIEW_CHANNEL: false
    });
  }

  public removeDiscordChannelForGuild(guild: Guild) {
    if(!this.discordGuild) return;

    const role = this.discordGuild.roles.find(x => x.name === `Guild: ${guild.name}`);
    const channel = this.discordGuild.channels.find(x => x.name === guild.name.split(' ').join('-').toLowerCase());

    if(role) role.delete();
    if(channel) channel.delete();
  }

}
