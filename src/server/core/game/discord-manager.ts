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
    if(!process.env.DISCORD_SECRET || !canServerNodeRunDiscord) {
      this.logger.log('Discord', 'Skipping Discord setup.');
      return;
    }

    this.onMessageCallback = (msg) => {
      this.syncDiscordGuildChannel();
      onMessageCallback(msg);
    };

    this.discord = new Discord.Client();

    try {
      await this.discord.login(process.env.DISCORD_SECRET);
      this.logger.log('Discord', 'Connected!');
    } catch(e) {
      this.logger.error(`Discord`, e.message);
      return;
    }

    this.discordGuild = this.discord.guilds.cache.get(process.env.DISCORD_GUILD_ID);

    this.discord.on('error', (error) => {
      this.logger.error('Discord', error);
    });

    this.discord.on('message', (message) => {
      this.syncDiscordGuildChannel();
      if((message.channel && this.discordChannel && message.channel.id !== this.discordChannel.id) || message.author.bot) return;

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
    this.syncDiscordGuildChannel();
    if(!this.discordChannel) return;

    this.sendChannelMessage(this.discordChannel, message);
  }

  public notifyGuildChannel(playerName: string, guild: Guild, key: string, message: string) {
    if(!this.discordGuild) return;
    this.syncDiscordGuildChannel();

    const crierLevel = guild.buildingLevels[GuildBuilding.Crier];
    const channel = this.discordGuild.channels.cache.find(x => x.name === guild.tag.split(' ').join('-').toLowerCase());
    if(!channel || !guild) return;

    if(!crierLevel || crierLevel < 1 || !guild.activeBuildings[GuildBuilding.Crier] || key === 'resources') return;

    if(crierLevel >= 1 && key === 'motd' && guild.motd !== message) {
      const charLimit = 500;
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
    return this.discordGuild.members.cache.find(u => u.user.tag === tag);
  }

  public isTagInDiscord(tag: string): boolean {
    if(!this.discordChannel) return false;
    return !!this.discordUserWithTag(tag);
  }

  public hasRole(tag: string, role: string): boolean {
    const roles = this.getUserRoles(tag);
    if(!roles) return false;
    return !!roles.cache.find(r => r.name === role);
  }

  public async removeGuildRole(player: Player) {
    if(!this.discordGuild || !player.discordTag || !player.guildName) return;

    const user = this.discordUserWithTag(player.discordTag);
    if(!user) return;

    this.discordGuild.roles.cache.forEach(x => {
      if(!x.name.includes('Guild:')) return;
      user.roles.remove(x);
    });

    const guildModRole = this.discordGuild.roles.cache.find(x => x.name === 'Guild Mod');
    if(guildModRole) {
      user.roles.remove(guildModRole);
    }
  }

  public async addGuildRole(player: Player) {
    if(!this.discordGuild || !player.discordTag || !player.guildName) return;

    const user = this.discordUserWithTag(player.discordTag);
    if(!user) return;

    const guildRole = this.discordGuild.roles.cache.find(x => x.name === `Guild: ${player.guildName}`);
    if(guildRole && !user.roles.cache.has(guildRole.id)) {
      await user.roles.add(guildRole);
    }

    const guild = player.$$game.guildManager.getGuildForPlayer(player);
    const guildModRole = this.discordGuild.roles.cache.find(x => x.name === 'Guild Mod');
    if(guildModRole && guild && guild.members[player.name] >= GuildMemberTier.Moderator) {
      user.roles.add(guildModRole);
    }
  }

  public async removeAllRoles(player: Player) {
    if(!this.discordGuild || !player.discordTag) return;

    const user = this.discordUserWithTag(player.discordTag);
    if(!user) return;

    const verified = this.discordGuild.roles.cache.find(x => x.name === 'Verified');
    if(verified) {
      user.roles.remove(verified);
    }

    this.removeGuildRole(player);
  }

  public async checkUserRoles(player: Player) {
    if(!this.discordGuild || !player.discordTag) return;

    const user = this.discordUserWithTag(player.discordTag);
    if(!user) return;

    const verified = this.discordGuild.roles.cache.find(x => x.name === 'Verified');
    if(verified && !user.roles.cache.has(verified.id)) {
      await user.roles.add(verified);
    }

    this.addGuildRole(player);
  }

  public getUserRoles(tag: string) {
    if(!this.discordGuild) return null;
    const guildUser = this.discordGuild.members.cache.find(u => `${u.user.username}#${u.user.discriminator}` === tag);
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

    const channelRef = <Discord.TextChannel>this.discord.channels.cache.get(process.env.DISCORD_CUSTOM_ITEM_CHANNEL_ID);
    if(!channelRef) return null;

    this.sendChannelMessage(channelRef, `Via ${fromPlayer}: ${itemText}`);
  }

  public getGuildChannel(guild: Guild): Discord.GuildChannel {
    if(!this.discordGuild) return;

    const channel = this.discordGuild.channels.cache.find(x => x.name === guild.tag.split(' ').join('-').toLowerCase());
    return channel ? channel.parentID === process.env.DISCORD_GUILD_CHANNEL_GROUP_ID ? channel : null : null;
  }

  public async checkDiscordChannel(guild: Guild) {
    const channel = this.getGuildChannel(guild);
    if(!channel) return;

    const count = Object.keys(guild.members).length;
    if(count < 10) {
      this.removeDiscordChannelForGuild(guild);
    }
  }

  public async createDiscordChannelForGuild(guild: Guild) {
    if(!this.discordGuild) return null;
    // Limit guild channels to guilds with more than 10 members
    if(Object.keys(guild.members).length < 10) return;

    const guildModRole = this.discordGuild.roles.cache.find(x => x.name === 'Guild Mod');

    let role = this.discordGuild.roles.cache.find(x => x.name === `Guild: ${guild.name}`);
    if(!role) {
      role = await this.discordGuild.roles.create({ data: { name: `Guild: ${guild.name}` } });
    }

    let channel = this.getGuildChannel(guild);

    try {
      if(!channel) {
        channel = await this.discordGuild.channels.create(guild.tag, { type: 'text' });
      }

      const categoryId = process.env.DISCORD_GUILD_CHANNEL_GROUP_ID;
      await channel.setParent(categoryId);

      await channel.overwritePermissions([
        {
          id: this.discord.user.id,
          allow: ['VIEW_CHANNEL']
        },
        {
          id: guildModRole,
          allow: ['MANAGE_MESSAGES']
        },
        {
          id: role,
          allow: ['VIEW_CHANNEL']
        },
        {
          id: this.discordGuild.id,
          deny: ['VIEW_CHANNEL']
        }
      ]);
    } catch(e) {
      this.logger.error(`Discord`, e.message);
    }
  }

  public async removeDiscordChannelForGuild(guild: Guild) {
    if(!this.discordGuild) return;

    const role = this.discordGuild.roles.cache.find(x => x.name === `Guild: ${guild.name}`);
    const channel = this.getGuildChannel(guild);

    if(role) await role.delete();
    if(channel) await channel.delete();
  }

  private syncDiscordGuildChannel() {
    if(this.discordChannel || !this.discordGuild) return;
    this.discordChannel = this.discordGuild.channels.cache.get(process.env.DISCORD_CHANNEL_ID) as Discord.TextChannel;
  }

}
