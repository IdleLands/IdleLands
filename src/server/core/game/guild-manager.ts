
import * as Chance from 'chance';
import { AutoWired, Singleton, Inject } from 'typescript-ioc';
import { set, flatten } from 'lodash';
import { DatabaseManager } from './database-manager';
import { GuildMemberTier, Channel, GuildChannelOperation, IItem, EventName,
  IBuffScrollItem, GuildBuilding, AllBaseStats, Stat,
  Profession, GachaReward, ICombatCharacter, AdventureLogEventType, ICombat } from '../../../shared/interfaces';
import { Guild, Player, Item } from '../../../shared/models';
import { PlayerManager } from './player-manager';
import { SubscriptionManager } from './subscription-manager';
import { EventManager } from './event-manager';
import { DiscordManager } from './discord-manager';
import { CombatHelper } from './combat-helper';
import { CombatAction } from '../../../shared/combat/combat-simulator';

@Singleton
@AutoWired
export class GuildManager {

  @Inject private db: DatabaseManager;
  @Inject private subscriptionManager: SubscriptionManager;
  @Inject private playerManager: PlayerManager;
  @Inject private discordManager: DiscordManager;
  @Inject private combatHelper: CombatHelper;

  private guilds: { [key: string]: Guild } = { };
  private guildRaidReadyPlayers: { [key: string]: ICombatCharacter[] };

  public get allGuilds() {
    return this.guilds;
  }

  public async init() {
    await this.loadGuilds();

    this.subscribeToGuilds();

    this.guildRaidReadyPlayers = { };
  }

  public isGuildRaiding(guildName: string): boolean {
    return !!this.guildRaidReadyPlayers[guildName];
  }

  private subscribeToGuilds() {
    this.subscriptionManager.subscribeToChannel(Channel.Guild, ({ operation, ...args }) => {
      switch(operation) {
        case GuildChannelOperation.Add: {
          this.createGuild(args.guildName);
          break;
        }

        case GuildChannelOperation.AddMember: {
          this.joinGuild(args.name, args.guildName, args.tier);
          break;
        }

        case GuildChannelOperation.RemoveMember: {
          this.leaveGuild(args.name, args.guildName);
          break;
        }

        case GuildChannelOperation.Update: {
          this.updateGuild(args.guildName, args.key, args.value);
          break;
        }

        case GuildChannelOperation.GiveItem: {
          this.shareItem(args.guildName, args.item);
          break;
        }

        case GuildChannelOperation.GiveScroll: {
          this.shareScroll(args.guildName, args.scroll);
          break;
        }

        case GuildChannelOperation.RequestRaidAssistance: {
          this.findAndShareAllRaidReadyPlayers(args.guildName);
          break;
        }

        case GuildChannelOperation.GiveRaidAssistance: {
          this.addSupportMembers(args.guildName, args.supports);
          break;
        }

        case GuildChannelOperation.RaidResults: {
          this.handleCombatRewards(args.guildName, args.boss, args.combat, args.winningParty);
          break;
        }
      }
    });
  }

  private async loadGuilds() {
    const guilds = await this.db.loadGuilds();
    guilds.forEach(guild => {
      if(Object.keys(guild.members).length === 0) {
        this.discordManager.removeDiscordChannelForGuild(guild);
        return;
      }
      this.addGuild(guild);
      this.checkDiscordUpgradeForGuild(guild);
    });
  }

  private addGuild(guild: Guild): void {
    this.guilds[guild.name] = guild;
  }

  public getGuild(guildName: string): Guild {
    return this.guilds[guildName];
  }

  private async saveGuild(guild: Guild) {
    return this.db.saveGuild(guild);
  }

  public async createGuildObject(owner: string, name: string, tag: string): Promise<Guild> {
    const guild = new Guild();
    guild.name = name;
    guild.tag = tag;

    guild.init();

    // first, try to add the guild to the database - checks indexes
    await this.saveGuild(guild);

    this.addGuild(guild);

    this.joinGuild(owner, name, GuildMemberTier.Leader);

    await this.saveGuild(guild);

    this.initiateCreateGuild(name);

    return guild;
  }

  private initiateCreateGuild(guildName: string) {
    this.subscriptionManager.emitToChannel(Channel.Guild, { operation: GuildChannelOperation.Add, guildName });
  }

  private async createGuild(guildName) {
    const guild = await this.db.loadGuild(guildName);
    if(!guild) return;

    this.addGuild(guild);
  }

  public initiateJoinGuild(name: string, guildName: string, tier: GuildMemberTier) {
    this.subscriptionManager.emitToChannel(Channel.Guild, {
      operation: GuildChannelOperation.AddMember, name, guildName, tier
    });
  }

  public initiateLeaveGuild(name: string, guildName: string) {
    this.subscriptionManager.emitToChannel(Channel.Guild, {
      operation: GuildChannelOperation.RemoveMember, name, guildName
    });
  }

  public joinGuild(name: string, guildName: string, tier: GuildMemberTier) {

    const guild = this.getGuild(guildName);
    if(!guild) throw new Error(`Guild ${guildName} does not exist; cannot join it.`);

    guild.addMember(name, tier);
    this.saveGuild(guild);

    const player = this.playerManager.getPlayer(name);
    if(!player) return;

    player.guildName = guildName;
    this.discordManager.addGuildRole(player);
    player.$$game.updatePlayer(player);

    this.db.clearAppsInvitesForPlayer(player.name);
  }

  public async leaveGuild(name: string, guildName: string) {
    const guild = this.getGuild(guildName);
    if(!guild) throw new Error(`Guild ${guildName} does not exist; cannot leave it.`);

    guild.removeMember(name);
    this.saveGuild(guild);

    const player = this.playerManager.getPlayer(name);
    if(!player) return;

    await this.discordManager.removeGuildRole(player);
    player.guildName = '';
    player.$$game.updatePlayer(player);
  }

  public updateGuildKey(guildName: string, key: string, value: any): void {
    this.updateGuild(guildName, key, value);
    this.saveGuild(this.getGuild(guildName));

    this.subscriptionManager.emitToChannel(Channel.Guild, {
      operation: GuildChannelOperation.Update,
      guildName, key, value
    });
  }

  private updateGuild(guildName: string, key: string, value: any): void {
    const guild = this.getGuild(guildName);
    if(!guild) return;

    set(guild, key, value);
  }

  public getGuildForPlayer(player: Player): Guild {
    if(player.guildName) {
      const guild = this.getGuild(player.guildName);
      return guild;
    }
  }

  public initiateShareItem(guildName: string, item: IItem) {
    this.subscriptionManager.emitToChannel(Channel.Guild, {
      operation: GuildChannelOperation.GiveItem,
      guildName,
      item
    });
  }

  public shareItem(guildName: string, itemData: IItem) {

    const guild = this.getGuild(guildName);
    if(!guild) return;

    Object.keys(guild.members).forEach(member => {
      const player = this.playerManager.getPlayer(member);
      if(!player) return;

      const item = new Item();
      item.init(itemData);
      item.regenerateUUID();

      player.$$game.eventManager.doEventFor(player, EventName.FindItem, { fromGuild: true, item });
    });
  }

  public initiateShareScroll(guildName: string, scroll: IBuffScrollItem) {
    this.subscriptionManager.emitToChannel(Channel.Guild, {
      operation: GuildChannelOperation.GiveScroll,
      guildName,
      scroll
    });
  }

  public shareScroll(guildName: string, scroll: IBuffScrollItem) {

    const guild = this.getGuild(guildName);
    if(!guild) return;

    Object.keys(guild.members).forEach(member => {
      const player = this.playerManager.getPlayer(member);
      if(!player) return;

      player.$inventory.addBuffScroll(scroll);
    });
  }

  public checkDiscordUpgradeForGuild(guild: Guild) {
    if(guild.buildingLevels[GuildBuilding.Crier] < 1) return;

    this.discordManager.createDiscordChannelForGuild(guild);
  }

  public raidBossRewards(level: number) {
    if(level % 50 !== 0 || level < 100) return [];

    const tier = ((level - 100) / 50) + 1;
    const rng = new Chance(level + ' ' + new Date().getMonth());

    const possibleRewards = [
      GachaReward.CrystalAstral, GachaReward.ItemGodly, GachaReward.XPPlayerMax, GachaReward.ILPMD
    ];

    if(tier >= 5) {
      possibleRewards.push(GachaReward.ItemGoatly);
    }

    if(tier >= 20) {
      possibleRewards.push(GachaReward.ItemOmega);
    }

    const rewards = [rng.pickone(possibleRewards)];

    if(tier >= 10) {
      rewards.push(rng.pickone(possibleRewards));
    }

    if(tier >= 25) {
      rewards.push(rng.pickone(possibleRewards));
    }

    return rewards;
  }

  public raidBoss(level: number) {
    if(level % 50 !== 0 || level < 100) return null;

    const rng = new Chance(level + ' ' + new Date().getMonth());

    const baseAttrs = {
      cost: 1000000 * level,
      level,
      profession: '',
      scaleStat: '',
      stats: {
        [Stat.HP]: 25000 * level
      },
      rewards: this.raidBossRewards(level)
    };

    const scaleStat = rng.pickone(Object.values(AllBaseStats));
    baseAttrs.scaleStat = scaleStat;

    const profession = rng.pickone(Object.values(Profession));
    baseAttrs.profession = profession;

    Object.values(AllBaseStats).forEach(stat => {
      baseAttrs.stats[stat] = 10 * level;
    });

    return baseAttrs;
  }

  public raidBosses(maxLevel: number) {
    const bosses = [];
    for(let i = 100; i <= maxLevel; i += 50) {
      bosses.push(this.raidBoss(i));
    }
    return bosses;
  }

  private findAndShareAllRaidReadyPlayers(guildName: string): void {
    const players = Object.keys(this.getGuild(guildName).members);

    const supports = flatten(players.map(playerName => {
      const player = this.playerManager.getPlayer(playerName);
      if(!player) return;

      if(!this.combatHelper.canDoCombat(player)) return;

      const pets = this.combatHelper.getAllPartyCombatPets([player]);
      return [...pets, this.combatHelper.createCombatCharacter(player)];
    }).filter(Boolean));

    this.subscriptionManager.emitToChannel(Channel.Guild, {
      operation: GuildChannelOperation.GiveRaidAssistance,
      guildName,
      supports
    });
  }

  private addSupportMembers(guildName: string, supports: ICombatCharacter[]) {
    if(!this.guildRaidReadyPlayers[guildName]) return;

    this.guildRaidReadyPlayers[guildName].push(...supports);
  }

  public initiateEncounterRaidBoss(initiator: string, guildName: string, boss) {
    const guild = this.getGuild(guildName);
    if(!guild) return;

    this.guildRaidReadyPlayers = this.guildRaidReadyPlayers || { };
    this.guildRaidReadyPlayers[guildName] = this.guildRaidReadyPlayers[guildName] || [];

    this.subscriptionManager.emitToChannel(Channel.Guild, { operation: GuildChannelOperation.RequestRaidAssistance, guildName });

    setTimeout(() => {
      const availHelp = this.guildRaidReadyPlayers[guildName];
      delete this.guildRaidReadyPlayers[guildName];

      // refund cost in case of no help
      if(availHelp.length === 0) {
        this.updateGuildKey(
          guildName,
          `resources.gold`,
          guild.resources.gold + boss.cost
        );
        return;
      }

      const { combat, simulator } = this.combatHelper.createAndRunRaidCombat(guildName, availHelp, boss);

      simulator.events$.subscribe(({ action, data }) => {
        if(action === CombatAction.Victory) {
          this.subscriptionManager.emitToChannel(Channel.Guild, {
            operation: GuildChannelOperation.RaidResults, guildName, combat, winningParty: data.winningParty, boss
          });
        }
      });

      simulator.beginCombat();

      // finish up
      const emitString = this.combatHelper.getCompressedCombat(combat);

      const playerNames = availHelp.map(x => x.realName);

      const messageData: any = {
        when: Date.now(),
        type: AdventureLogEventType.Combat,
        message: `${initiator} initiated a guild raid boss fight for ${guildName} against a level ${boss.level} ${boss.profession}!`,
        combatString: emitString
      };

      this.subscriptionManager.emitToChannel(Channel.PlayerAdventureLog, { playerNames, data: messageData });
    }, 5000);
  }

  public handleCombatRewards(guildName: string, boss, combat: ICombat, winningParty: number) {

    const didPlayersWin = winningParty === 0;

    this.combatHelper.handleRewards(combat, winningParty);

    Object.values(combat.characters)
      .filter(char => char.combatPartyId === 0)
      .forEach(char => {

        const playerRef = this.playerManager.getPlayer(char.realName);
        if(!playerRef) return;

        const raidTier = ((boss.level - 100) / 50) + 1;
        playerRef.increaseStatistic(`Raid/Total/${didPlayersWin ? 'Win' : 'Lose'}`, 1);
        playerRef.increaseStatistic(`Raid/Tiered/Tier${raidTier}/${didPlayersWin ? 'Win' : 'Lose'}`, 1);
      });
  }

}
