import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import * as Discord from 'discord.js';

import { Logger } from '../logger';
import { IMessage, GuildMemberTier, GuildBuilding } from '../../../shared/interfaces';
import { Guild, Player } from '../../../shared/models';

@Singleton
@AutoWired
export class DiscordManager {

  @Inject private logger: Logger;

  private discord: Discord.Client;
  private discordGuild: Discord.Guild;
  private discordChannel: Discord.TextChannel;
  private crierStorage = { };

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
      this.logger.error('Discord', new Error(error.message));
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

  public dispatchCrier(): void {
    // How many lines per message
    const size = 10;

    // Loop through all the stored messages
    Object.keys(this.crierStorage).forEach(key => {
      const groups = [];
      const store = this.crierStorage[key];

      // Split messages into groups of 10
      for(let i = 0, x = store.messages.length; i < x; i += size) {
        groups.push(store.messages.slice(i, i + size));
      }

      // Send each group of messages
      groups.forEach(group => {
        this.sendChannelMessage(store.channel, group.join('\n'));
      });

      // Delete from storage
      delete this.crierStorage[key];
    });
  }

  public updateUserCount(userCount: number): void {
    if(!this.discordChannel) return;

    this.discordChannel.setTopic(`${userCount} player(s) in game`);
  }

  public sendMessage(message: string): void {
    if(!this.discordChannel) return;

    this.sendChannelMessage(this.discordChannel, message);
  }

  public notifyGuildChannel(playerName: string, guild: Guild, key: string, message: string) {
    if(!this.discordGuild) return;

    const crierLevel = guild.buildingLevels[GuildBuilding.Crier];
    const channel = this.discordGuild.channels.find(x => x.name === guild.tag.split(' ').join('-').toLowerCase());

    if(!crierLevel || crierLevel < 1 || !guild.activeBuildings[GuildBuilding.Crier] || key === 'resources') return;

    if(crierLevel >= 1 && key === 'motd' && guild.motd !== message) {
      const charLimit = 500;
      if(!channel || !guild) return;
      channel.setTopic(message.substring(0, charLimit));
    } else if(crierLevel < 2 && ['members', 'recruitment', 'taxes'].includes(key)) {
      return;
    } else if(crierLevel < 3 && ['buildingLevels', 'activeBuildings', 'raid'].includes(key)) {
      return;
    }

    if(!this.crierStorage[guild.name]) {
      this.crierStorage[guild.name] = {
        channel,
        messages: []
      };
    }

    this.crierStorage[guild.name].messages.push(`<☆System> ${message}`);
  }

  public discordUserWithTag(tag: string): Discord.GuildMember {
    if(!this.discordChannel) return null;
    return this.discordGuild.members.find(u => u.user.tag === tag);
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
    if(!user) return;

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
    if(!user) return;

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
    if(!user) return;

    const verified = this.discordGuild.roles.find(x => x.name === 'Verified');
    if(verified) {
      user.removeRole(verified);
    }

    this.removeGuildRole(player);
  }

  public async checkUserRoles(player: Player) {
    if(!this.discordGuild || !player.discordTag) return;

    const user = this.discordUserWithTag(player.discordTag);
    if(!user) return;

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

  public sendChannelMessage(channel: any, message: string) {
    // Stop the bot mentioning everyone or here
    message = message.replace(/@everyone/gi, 'everyone').replace(/@here/gi, 'here');
    // Add ability to @ users
    (message.match(/(@[^\s|\W]+)/gi) || []).forEach(function(match) {
      const name = match.substr(1);
      const user = channel.members.find(val => val.user.username === name || val.nickname === name);
      if(user) message = message.replace(match, `<@${user.id}>`);
    });
    channel.send(message);
  }

  public submitCustomItem(fromPlayer: string, itemText: string) {
    if(!this.discordGuild) return null;

    const discordChannel = process.env.DISCORD_CUSTOM_ITEM_CHANNEL_ID;
    if(!discordChannel) return null;

    const channelRef = <Discord.TextChannel>this.discord.channels.get(process.env.DISCORD_CUSTOM_ITEM_CHANNEL_ID);
    if(!channelRef) return null;

    this.sendChannelMessage(channelRef, `Via ${fromPlayer}: ${itemText}`);
  }

  public async createDiscordChannelForGuild(guild: Guild) {
    if(!this.discordGuild) return null;

    const guildModRole = this.discordGuild.roles.find(x => x.name === 'Guild Mod');

    let role = this.discordGuild.roles.find(x => x.name === `Guild: ${guild.name}`);
    if(!role) {
      role = await this.discordGuild.createRole({ name: `Guild: ${guild.name}`});
    }

    let channel = this.discordGuild.channels.find(x => x.name === guild.tag.split(' ').join('-').toLowerCase());
    if(!channel) {
      channel = await this.discordGuild.createChannel(guild.tag, 'text');
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

    await channel.overwritePermissions(this.discordGuild.id, {
      VIEW_CHANNEL: false
    });
  }

  public removeDiscordChannelForGuild(guild: Guild) {
    if(!this.discordGuild) return;

    const role = this.discordGuild.roles.find(x => x.name === `Guild: ${guild.name}`);
    const channel = this.discordGuild.channels.find(x => x.name === guild.tag.split(' ').join('-').toLowerCase());

    if(role) role.delete();
    if(channel) channel.delete();
  }

}
