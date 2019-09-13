
import { capitalize } from 'lodash';

import { censorSensor } from '../core/static/profanity-filter';

import { ServerEventName, ServerEvent, GuildResource, GuildBuilding, GuildBuildingNames,
  GuildMemberTier, GuildBuildingUpgradeCosts } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class CreateGuildEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildCreate;
  description = 'Create a new guild.';
  args = 'guildName, guildTag';

  async callback({ guildName, guildTag } = { guildName: '', guildTag: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.guildName) return this.gameError('You already have a guild!');

    const guildCost = 100000000;

    if(player.gold < guildCost) return this.gameError('You need 100,000,000 gold to do that.');
    if(guildName.length < 2) return this.gameError('Guild name must not be less than 2 characters.');
    if(guildTag.length < 2) return this.gameError('Guild tag must not be less than 2 characters.');
    if(guildName.length > 20) return this.gameError('Guild name must not be greater than 20 characters.');
    if(guildTag.length > 5) return this.gameError('Guild tag must not be greater than 5 characters.');

    if(censorSensor.isProfaneIsh(guildName)) return this.gameError(`Guild name is a bit too crude.`);
    if(censorSensor.isProfaneIsh(guildTag)) return this.gameError(`Guild tag is a bit too crude.`);

    try {
      this.game.guildManager.createGuildObject(player.name, guildName, guildTag);
    } catch(e) {
      return this.gameError('Could not create guild - likely, the name or tag are already taken.');
    }

    this.game.chatHelper.sendMessageFromClient({
      message: `A new guild "${guildName}" [${guildTag}] was founded by ${player.name}!`,
      playerName: '☆System'
    });

    player.spendGold(guildCost);
    this.game.databaseManager.clearAppsInvitesForPlayer(player.name);

    this.game.updatePlayer(player);
    this.gameSuccess(`Created guild "${guildName}" [${guildTag}]`);
  }
}
export class GuildSetApplyEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildSetRecruitment;
  description = 'Set guild application mode.';
  args = 'newMode';

  async callback({ newMode } = { newMode: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    if(guild.members[player.name] < GuildMemberTier.Moderator) return this.gameError('Not a mod.');

    if(!['Closed', 'Open', 'Apply'].includes(newMode)) return this.gameError('Invalid recruit mode.');
    this.game.guildManager.updateGuildKey(player.guildName, 'recruitment', newMode);

    this.gameSuccess(`Set guild recruit mode to ${newMode}.`);
  }
}
export class GuildSetMOTDEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildSetMOTD;
  description = 'Set guild MOTD.';
  args = 'newMOTD';

  async callback({ newMOTD } = { newMOTD: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    if(guild.members[player.name] < GuildMemberTier.Moderator) return this.gameError('Not a mod.');

    if(newMOTD.length > 2000) newMOTD = newMOTD.slice(0, 2000);

    this.game.guildManager.updateGuildKey(player.guildName, 'motd', newMOTD);

    this.gameSuccess(`Set guild MOTD.`);
  }
}

export class GuildSetResourceTaxEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildSetTax;
  description = 'Set guild tax.';
  args = 'resource, newTax';

  async callback({ resource, newTax } = { resource: '', newTax: 0 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    if(guild.members[player.name] < GuildMemberTier.Moderator) return this.gameError('Not a mod.');

    if(resource !== 'gold') return this.gameError('Invalid resource name');
    if(newTax < 0 || newTax > 50) return this.gameError('Tax rate must be between 0 and 50');

    newTax = Math.round(newTax);

    this.game.guildManager.updateGuildKey(player.guildName, `taxes.${resource}`, newTax);

    this.gameSuccess(`Set guild ${resource} tax to ${newTax}%.`);
  }
}

export class GuildDonateResourceEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildDonateResource;
  description = 'Donate a resource to the guild.';
  args = 'resource, amount';

  async callback({ resource, amount } = { resource: '', amount: 0 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    amount = Math.round(+amount);
    if(isNaN(amount) || !isFinite(amount) || amount <= 0) return this.gameError('Invalid donation amount.');

    if(!['gold', 'wood', 'clay', 'stone', 'astralium'].includes(resource)) return this.gameError('Invalid resource name');
    if(resource === 'gold' && player.gold < amount) return this.gameError('Not enough gold for that.');
    if(resource !== 'gold' && !player.$inventory.hasResource(<GuildResource>resource, amount)) return this.gameError('Not enough.');

    if(resource === 'gold') player.spendGold(amount);
    if(resource !== 'gold') player.$inventory.spendResource(<GuildResource>resource, amount);

    const existing = guild.resources[resource] || 0;

    player.increaseStatistic(`Guild/Donate/Resource/${capitalize(resource)}`, amount);

    this.game.guildManager.updateGuildKey(player.guildName, `resources.${resource}`, existing + amount);

    this.gameSuccess(`Donated ${amount} ${resource} to guild.`);
  }
}

export class GuildDonateCrystalEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildDonateCrystal;
  description = 'Donate a crystal resource to the guild.';
  args = 'crystal, amount';

  async callback({ crystal, amount } = { crystal: '', amount: 0 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    amount = Math.round(+amount);
    if(isNaN(amount) || !isFinite(amount) || amount <= 0) return this.gameError('Invalid donation amount.');

    if(!['Red', 'Green', 'Yellow', 'Orange', 'Blue', 'Purple', 'Astral'].includes(crystal)) return this.gameError('Invalid crystal name');

    const resource = `Crystal${crystal}`;

    if(!player.$pets.hasAscensionMaterial(resource, amount)) return this.gameError('Not enough.');
    player.$pets.subAscensionMaterial(resource, amount);

    const existing = guild.resources[resource] || 0;

    player.increaseStatistic(`Guild/Donate/Crystal/${capitalize(crystal)}`, amount);

    this.game.guildManager.updateGuildKey(player.guildName, `crystals.${resource}`, existing + amount);

    this.gameSuccess(`Donated ${amount} ${resource} to guild.`);
  }
}

export class GuildToggleBuildingEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildToggleBuilding;
  description = 'Toggle a building for your guild.';
  args = 'building';

  async callback({ building } = { building: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    if(guild.members[player.name] < GuildMemberTier.Moderator) return this.gameError('Not a mod.');

    if(!GuildBuildingNames[building]) return this.gameError('Invalid building');

    if(!guild.activeBuildings[building] && building.includes(':')) {
      const buildingFirst = building.split(':')[0];
      Object.keys(guild.activeBuildings).forEach(checkBuilding => {
        if(!checkBuilding.startsWith(buildingFirst)) return;

        this.game.guildManager.updateGuildKey(player.guildName, `activeBuildings.${checkBuilding}`, false);
      });
    }

    this.game.guildManager.updateGuildKey(player.guildName, `activeBuildings.${building}`, !guild.activeBuildings[building]);
  }
}

export class GuildUpgradeBuildingEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildUpgradeBuilding;
  description = 'Upgrade a building for your guild.';
  args = 'building';

  async callback({ building } = { building: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    if(guild.members[player.name] < GuildMemberTier.Moderator) return this.gameError('Not a mod.');

    if(!GuildBuildingNames[building]) return this.gameError('Invalid building');

    const level = (guild.buildingLevels[building] || 0) + 1;
    if(guild.buildingLevels[GuildBuilding.GuildHall] < level) return this.gameError('Guild hall must be leveled first.');

    const costs = GuildBuildingUpgradeCosts[building](level);

    const canDo = Object.keys(costs).every(costKey => guild.resources[costKey] >= costs[costKey]);
    if(!canDo) return this.gameError('Not enough resources.');

    Object.keys(costs).forEach(costKey => {
      this.game.guildManager.updateGuildKey(
        player.guildName,
        `resources.${costKey}`,
        guild.resources[costKey] - costs[costKey]
      );
    });

    this.game.guildManager.updateGuildKey(
      player.guildName,
      `buildingLevels.${building}`,
      (guild.buildingLevels[building] || 0) + 1
    );

    this.gameSuccess(`Leveled up your building!`);
  }
}

export class GuildApplyJoinEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildApplyJoin;
  description = 'Join or apply to a guild.';
  args = 'guildName';

  async callback({ guildName } = { guildName: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.guildName) return this.gameError('You already are in a guild!');

    const guild = this.game.guildManager.getGuild(guildName);
    if(!guild) return this.gameError('That guild is not valid!');

    switch(guild.recruitment) {
      case 'Closed': {
        return this.gameError('Guild is closed and cannot be applied to.');
      }

      case 'Apply': {
        // TODO: apply
        break;
      }

      case 'Open': {
        this.game.guildManager.joinGuild(player.name, guildName, GuildMemberTier.Member);
        this.gameSuccess(`You joined the guild!`);
        break;
      }
    }

  }
}

export class GuildLeaveEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildLeave;
  description = 'Leave your guild.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    // leaders can only leave if they're the last person in the guild or they promote someone else
    if(guild.members[player.name] === GuildMemberTier.Leader && Object.keys(guild.members).length > 1) {
      const leaderCount = Object.keys(guild.members).map(m => guild.members[m]).filter(v => v === GuildMemberTier.Leader).length;

      if(leaderCount <= 1) return this.gameError('Cannot leave guild when there are no other leaders to take over.');
    }

    this.game.guildManager.initiateLeaveGuild(player.name, player.guildName);

    this.gameSuccess(`Left guild.`);
  }
}

export class GuildKickEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildKick;
  description = 'Kick someone from your guild.';
  args = 'kickPlayer';

  async callback({ kickPlayer } = { kickPlayer: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    if(guild.members[player.name] < GuildMemberTier.Moderator) return this.gameError('Not a mod.');

    const member = guild.members[kickPlayer];
    if(!member) return this.gameError('Person is not in your guild.');

    if(member > GuildMemberTier.Member) return this.gameError('Cannot kick anyone unless they are a normal member.');

    this.game.guildManager.initiateLeaveGuild(kickPlayer, player.guildName);

    this.gameSuccess(`Kicked ${kickPlayer} from guild.`);
  }
}

export class GuildPromoteEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildPromoteMember;
  description = 'Promote someone in your guild.';
  args = 'promotePlayer';

  async callback({ promotePlayer } = { promotePlayer: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    if(guild.members[player.name] < GuildMemberTier.Leader) return this.gameError('Not a leader.');

    const member = guild.members[promotePlayer];
    if(!member) return this.gameError('Person is not in your guild.');

    let newTier = 0;
    if(member === GuildMemberTier.Member) newTier = GuildMemberTier.Moderator;
    if(member === GuildMemberTier.Moderator) newTier = GuildMemberTier.Leader;

    if(newTier === 0) return this.gameError('Cannot promote anymore.');

    this.game.guildManager.updateGuildKey(
      player.guildName,
      `members.${promotePlayer}`,
      newTier
    );

    this.gameSuccess(`Promoted ${promotePlayer}.`);
  }
}

export class GuildDemoteEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.GuildDemoteMember;
  description = 'Demote someone in your guild.';
  args = 'demotePlayer';

  async callback({ demotePlayer } = { demotePlayer: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const guild = this.game.guildManager.getGuild(player.guildName);
    if(!guild) return this.gameError('Your guild is not valid!');

    if(guild.members[player.name] < GuildMemberTier.Leader) return this.gameError('Not a leader.');

    const member = guild.members[demotePlayer];
    if(!member) return this.gameError('Person is not in your guild.');

    let newTier = 0;
    if(member === GuildMemberTier.Leader) newTier = GuildMemberTier.Moderator;
    if(member === GuildMemberTier.Moderator) newTier = GuildMemberTier.Member;

    if(newTier === 0) return this.gameError('Cannot demote anymore.');

    this.game.guildManager.updateGuildKey(
      player.guildName,
      `members.${demotePlayer}`,
      newTier
    );

    this.gameSuccess(`Demoted ${demotePlayer}.`);
  }
}

/* TODO:
- add invite member call (make sure one does not exist for that player/guild already, make sure recruitment mode allows this)
- add apply member call (make sure one does not exist for player/guild already, make sure applications are open)
- add ability to discard application
- add call to remove application
- add call to approve application (member must be online)
- add call to remove invite
- add call to approve invite
- add call to leave guild
- add promote member call (member -> mod -> leader -> mod -> member)
*/
