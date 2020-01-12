import { ServerSocketEvent, Item } from '../../shared/models';
import { ServerEvent, ServerEventName, ModeratorTier, IItem, EventName } from '../../shared/interfaces';
import { isString } from 'lodash';

export class GMMotdEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMSetMOTD;
  description = 'GM: Set the MOTD for the game';
  args = 'motd';

  async callback({ motd } = { motd: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    this.game.gmHelper.initiateSetMOTD(motd);
  }
}

export class GMToggleGuildAppBanEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMToggleGuildAppBan;
  description = 'GM: Toggle a player\'s ability to send guild applications';
  args = 'playerName';

  async callback({ playerName } = { playerName: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();
    if(player.modTier < ModeratorTier.ChatMod) return this.gameError('Lol no.');
    const result = this.game.gmHelper.guildAppBan(playerName);
    if(isString(result)) this.gameError(result);
    else this.gameMessage(`${playerName} can ${ result ? 'no longer' : 'now' } send guild applications.`);
  }
}

export class GMToggleBannedEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMToggleBanned;
  description = 'GM: Ban or unban a user.';
  args = 'playerName';

  async callback({ playerName } = { playerName: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();
    if(player.modTier < ModeratorTier.ChatMod) return this.gameError('Lol no.');

    const result = await this.game.gmHelper.toggleBan(playerName);
    if(isString(result)) this.gameError(result);
    else this.gameMessage(`${playerName} has been ${ result ? 'banned.' : 'unbanned.' }`);
  }
}

export class GMToggleMuteEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMToggleMute;
  description = 'GM: Toggle mute for a player';
  args = 'playerName, duration';

  async callback({ playerName, duration } = { playerName: '', duration: 60 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.modTier < ModeratorTier.ChatMod) return this.gameError('Lol no.');

    this.game.gmHelper.initiateMute(playerName, duration);

  }
}

export class GMChangeModTierEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMChangeModTier;
  description = 'GM: Change mod tier for a player';
  args = 'playerName, newTier';

  async callback({ playerName, newTier } = { playerName: '', newTier: 0 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.modTier < ModeratorTier.Admin) return this.gameError('Lol no.');

    this.game.gmHelper.initiateChangeModTier(playerName, newTier);

  }
}

export class GMStartFestivalEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMStartFestival;
  description = 'GM: Start a festival';
  args = 'festival';

  async callback({ festival } = { festival: null }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    if(!festival) return this.gameError('No festival specified.');

    this.game.festivalManager.startGMFestival(player, festival);

  }
}

export class GMSetStatisticEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMSetStatistic;
  description = 'GM: Set statistic for a player';
  args = 'player, statistic, value';

  async callback({ player, statistic, value } = { player: '', statistic: '', value: 0 }) {
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    const playerRef = this.game.playerManager.getPlayer(player);
    if(!playerRef) return this.gameError('Could not find that player.');

    const statVal = +value;
    if(isNaN(statVal)) return this.gameError('Stat value invalid.');

    playerRef.$statistics.set(statistic, statVal);
    this.gameMessage(`Set ${player} ${statistic} to ${statVal.toLocaleString()}.`);
  }
}

export class GMSetNameEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMSetName;
  description = 'GM: Set name for a player';
  args = 'player, newName';

  async callback({ player, newName } = { player: '', newName: '' }) {
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    const playerRef = this.game.playerManager.getPlayer(player);
    if(playerRef) return this.gameError('That player is online. You cannot rename an online player.');

    this.game.databaseManager.renamePlayer(player, newName);
    this.gameMessage(`Set ${player} name to ${newName}.`);
  }
}

export class GMSetPlayerLocation extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMSetPlayerLocation;
  description = 'GM: Teleport a player to a certain location';
  args = 'player, x, y, map, teleport';

  async callback({ player, x, y, map, teleport } = { player: '', x: 10, y: 10, map: 'Norkos', teleport: '' }) {
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');
    const playerRef = this.game.playerManager.getPlayer(player);
    if(!playerRef) return this.gameError('Could not find that player.');

    const allTeleports = this.game.assetManager.allTeleports;
    let target = {
      x: x,
      y: y,
      map: map
    };

    // Are we using one of the existing teleports?
    if(teleport !== '') {
      if(!allTeleports[teleport]) return this.gameError('Unable to find the requested teleport');
      target = allTeleports[teleport];
    }

    // Now verify that we can actually teleport there and that the player is not out of bounds
    const tile = myPlayer.$$game.movementHelper.isValidTile(target.map, target.x, target.y);
    if(!tile) return this.gameError('Unfortunately you can not teleport a player into limbo. Please enter a valid location.');

    myPlayer.$$game.movementHelper.doTeleport(playerRef, target);
    this.gameMessage(`Teleported ${playerRef.name} to x=${target.x}, y=${target.y}, map=${target.map}`);
  }
}

export class GMSetClassEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMSetClass;
  description = 'GM: Set class for a player';
  args = 'player, newClass';

  async callback({ player, newClass } = { player: '', newClass: '' }) {
    // foo
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    const playerRef = this.game.playerManager.getPlayer(player);
    if(!playerRef) return this.gameError('Could not find that player.');

    const profession = this.game.professionHelper.getProfession(newClass);
    if(!profession) return this.gameError('Could not find targeted profession/class.');

    playerRef.changeProfession(profession);
    this.gameMessage(`Set ${player}'s class to ${newClass}`);
  }
}

export class GMSetLevelEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMSetLevel;
  description = 'GM: Set level for a player';
  args = 'player, newLevel';

  async callback({ player, newLevel } = { player: '', newLevel: 0 }) {
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    const playerRef = this.game.playerManager.getPlayer(player);
    if(!playerRef) return this.gameError('Could not find that player.');

    const levelVal = +newLevel;
    if(isNaN(levelVal)) return this.gameError('ILP value invalid.');

    playerRef.level.set(levelVal);
    this.gameMessage(`Set ${player} level to ${levelVal.toLocaleString()}.`);
  }
}

export class GMGiveILPEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMGiveILP;
  description = 'GM: Give ILP to a player';
  args = 'player, ilp';

  async callback({ player, ilp } = { player: '', ilp: 0 }) {
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    const playerRef = this.game.playerManager.getPlayer(player);
    if(!playerRef) return this.gameError('Could not find that player.');

    const ilpVal = +ilp;
    if(isNaN(ilpVal)) return this.gameError('ILP value invalid.');

    playerRef.gainILP(ilpVal);
    this.gameMessage(`Gave ${player} ${ilpVal.toLocaleString()} ILP.`);
  }
}

export class GMGiveGoldEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMGiveGold;
  description = 'GM: Give gold to a player';
  args = 'player, gold';

  async callback({ player, gold } = { player: '', gold: 0 }) {
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    const playerRef = this.game.playerManager.getPlayer(player);
    if(!playerRef) return this.gameError('Could not find that player.');

    const goldVal = +gold;
    if(isNaN(goldVal)) return this.gameError('Gold value invalid.');

    playerRef.gainGold(goldVal, false);
    this.gameMessage(`Gave ${player} ${goldVal.toLocaleString()} gold.`);
  }
}

export class GMGiveItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMGiveItem;
  description = 'GM: Give item to a player';
  args = 'player, item';

  async callback({ player, item } = { player: '', item: { name: '', type: '', itemClass: '', stats: { } } }) {
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    const playerRef = this.game.playerManager.getPlayer(player);
    if(!playerRef) return this.gameError('Could not find that player.');

    if(!item.name || !item.itemClass || !item.type) return this.gameError('Invalid item data');
    const itemRef = new Item();
    itemRef.init(item as IItem);

    this.game.eventManager.doEventFor(playerRef, EventName.FindItem, { item: itemRef });
  }
}

export class GMPortCharacterEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMPortCharacterId;
  description = 'GM: Port a character to a different character';
  args = 'player, newPlayer';

  async callback({ player, newPlayer } = { player: '', newPlayer: '' }) {
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    const playerRef = this.game.playerManager.getPlayer(player);
    if(playerRef) return this.gameError('That player is online. You cannot port an online player.');

    const playerRef2 = this.game.playerManager.getPlayer(newPlayer);
    if(playerRef2) return this.gameError('That player is online. You cannot port an online player.');

    try {
      const worked = await this.game.databaseManager.movePlayerToNewId(player, newPlayer);
      if(!worked) return this.gameError('Something went wrong. Probably, one of the names was not a valid player.');
    } catch(e) {
      return this.gameError('Something bad happened.');
    }

    this.gameMessage(`Set ${player} id to ${newPlayer}.`);
  }
}

export class GMResetGlobalEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMResetGlobal;
  description = 'GM: Reset the current global quests';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    this.game.globalQuestManager.resetAllQuests();
  }
}

export class GMGiveGuildResourcesEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GMGiveGuildResrouces;
  description = 'GM: Give resources to a guild';
  args = 'guildName, gold, wood, clay, stone, astralium';

  async callback({ guildName, gold, wood, clay, stone, astralium } = { guildName: '', gold: 0, wood: 0, clay: 0, stone: 0, astralium: 0 }) {
    const myPlayer = this.player;
    if(!myPlayer) return this.notConnected();

    if(myPlayer.modTier < ModeratorTier.GameMod) return this.gameError('Lol no.');

    const guild = this.game.guildManager.getGuild(guildName);
    if(!guild) return this.gameError('That guild is not valid!');

    const resources = { gold, wood, clay, stone, astralium };

    let guildMessage = `${myPlayer.name} has given`;

    ['gold', 'wood', 'clay', 'stone', 'astralium'].forEach(resource => {
      const amount = +(resources[resource] || 0);
      if(!amount) return;

      if(isNaN(amount)) return this.gameError('Gold value invalid.');

      const existing = guild.resources[resource] || 0;
      this.game.guildManager.updateGuildKey(guildName, `resources.${resource}`, existing + amount);
      guildMessage += ` ${amount} ${resource},`;
    });

    guildMessage = guildMessage.substring(0, guildMessage.length - 1);
    guildMessage += ' to the guild treasury.';

    this.game.discordManager.notifyGuildChannel(myPlayer.name, guild, `resources`, guildMessage);

    this.gameMessage(`Did it.`);
  }
}
