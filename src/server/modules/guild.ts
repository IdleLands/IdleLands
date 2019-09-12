
import { capitalize } from 'lodash';

import { censorSensor } from '../core/static/profanity-filter';

import { ServerEventName, ServerEvent, GuildResource, GuildBuilding, GuildBuildingNames, GuildMemberTier } from '../../shared/interfaces';
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
export class GuildSetMOTD extends ServerSocketEvent implements ServerEvent {
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

export class GuildSetResourceTax extends ServerSocketEvent implements ServerEvent {
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
    if(newTax < 0 || newTax > 15) return this.gameError('Tax rate must be between 0 and 15');

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

/* TODO:
- add building upgrade call
- add invite member call (make sure one does not exist for that player/guild already, make sure recruitment mode allows this)
- add apply member call (make sure one does not exist for player/guild already, make sure applications are open)
- add ability to discard application
- add call to remove application
- add call to approve application (member must be online)
- add call to remove invite
- add call to approve invite
- add call to disband guild
- add call to leave guild
- add promote member call (member -> mod -> leader -> mod -> member)
*/
