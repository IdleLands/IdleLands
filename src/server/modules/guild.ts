
import { censorSensor } from '../core/static/profanity-filter';

import { ServerEventName, ServerEvent } from '../../shared/interfaces';
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

    player.spendGold(guildCost);
    this.game.databaseManager.clearAppsInvitesForPlayer(player.name);

    this.game.updatePlayer(player);
    this.gameSuccess(`Created guild "${guildName}" [${guildTag}]`);
  }
}

/* TODO:
- add guild motd update call (limit to 2000 chars)
- add donate resource to guild call (allow to specify amount)
- add donate crystal to guild call (allow to specify amount)
- add update guild tax rate call
- add building slot change call
- add building upgrade call
- add invite member call (make sure one does not exist for that player/guild already, make sure recruitment mode allows this)
- add apply member call (make sure one does not exist for player/guild already, make sure applications are open)
- add ability to discard application
- add call to remove application
- add call to approve application (member must be online)
- add call to remove invite
- add call to approve invite
- add call to change recruitment mode
- add call to disband guild
- add call to leave guild
- add promote member call (member -> mod -> leader -> mod -> member)
*/
