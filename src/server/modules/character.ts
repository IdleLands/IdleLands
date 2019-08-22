
import { includes } from 'lodash';

import { ServerEventName, ServerEvent, PremiumTier, ContributorTier } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class ChangeGenderEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterGender;
  description = 'Change your characters gender.';
  args = 'newGender';

  async callback({ newGender } = { newGender: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const possibleGenders = player.availableGenders;

    if(!includes(possibleGenders, newGender)) return this.gameError('Invalid gender specified');

    player.changeGender(newGender);
    this.game.updatePlayer(player);
    this.gameSuccess(`Gender is now "${newGender}"`);
  }
}

export class ChangeTitleEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterTitle;
  description = 'Change your characters title.';
  args = 'newTitle';

  async callback({ newTitle } = { newTitle: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    const possibleTitles = player.availableTitles;

    if(!newTitle) {
      player.title = '';
      this.game.updatePlayer(player);
      this.gameSuccess(`Title is now unset.`);
      return;
    }

    if(!includes(possibleTitles, newTitle)) return this.gameError('Invalid title specified');

    player.changeTitle(newTitle);
    this.game.updatePlayer(player);
    this.gameSuccess(`Title is now "${newTitle}"`);
  }
}

export class AscendEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterAscend;
  description = 'Ascend.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();
    if(player.canLevelUp()) return this.gameError('You are not currently able to ascend.');

    player.ascend();
    this.game.updatePlayer(player);

    this.gameSuccess(`You have ascended!`);
  }
}

export class OOCAbilityEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterOOCAction;
  description = 'Execute your classes OOC action.';
  args = '';

  async callback() {
    const player = this.player;
    if(!player) return this.notConnected();

    if(player.stamina.total < player.$profession.oocAbilityCost) return this.gameError('You do not have enough stamina!');

    const result = player.oocAction();
    if(result.success == false) return this.gameError(result.message);

    this.gameMessage(result.message);

    this.game.updatePlayer(player);
  }
}

export class DivineDirectionEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterDivineDirection;
  description = 'Set the Divine Direction of your character.';
  args = 'x, y';

  async callback({ x, y } = { x: 0, y: 0 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    player.setDivineDirection(x, y);

    this.game.updatePlayer(player);
    // this.gameMessage(player.divineDirection ? 'You have set a Divine Direction!' : 'You no longer have a Divine Direction!');
  }
}

export class LeavePartyEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterLeaveParty;
  description = 'Leave your party.';
  args = '';

  async callback({ x, y } = { x: 0, y: 0 }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(!player.$party) return this.gameError('You are not in a party.');

    this.game.partyHelper.playerLeave(player);
    this.gameMessage('You left your party!');
  }
}

export class ChangeDiscordTagEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterDiscordTag;
  description = 'Change your characters associated discord tag.';
  args = 'discordTag';

  async callback({ discordTag } = { discordTag: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(!discordTag) {
      player.discordTag = '';
      player.$statistics.set('Game/Contributor/ContributorTier', ContributorTier.None);
      player.$premium.setTier(PremiumTier.None);
      player.syncPremium();
      return this.gameMessage('Unset your Discord tag! Your Premium benefits have been reset.');
    }

    if(player.discordTag && discordTag !== player.discordTag) {
      if(!this.game.discordManager.isTagInDiscord(discordTag)) return this.gameError('That user is not in Discord!');
      if(await this.game.databaseManager.findPlayerWithDiscordTag(discordTag)) return this.gameError('That Discord tag is already taken!');
    }

    player.discordTag = discordTag;

    let newPremium = PremiumTier.None;
    if(this.game.discordManager.hasRole(discordTag, 'Patron')) newPremium = PremiumTier.Subscriber;
    if(this.game.discordManager.hasRole(discordTag, 'Patron Saint')) newPremium = PremiumTier.Subscriber2;

    player.$premium.setTier(newPremium);

    let msg = `You updated your discord tag!`;
    if(newPremium > 0) {
      msg = `${msg} Thanks for your support!`;
    }

    if(this.game.discordManager.hasRole(discordTag, 'Collaborator')) {
      player.$statistics.set('Game/Contributor/ContributorTier', ContributorTier.Contributor);
    }

    player.syncPremium();
    this.gameMessage(msg);

    this.game.updatePlayer(player);
  }
}

export class ChangeIdleLands3CharacterEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.CharacterChangeIdlelands3;
  description = 'Change your characters associated IdleLands 3 character.';
  args = 'il3CharName';

  async callback({ il3CharName } = { il3CharName: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(!il3CharName) {
      player.il3CharName = '';
      player.syncIL3({});
      return this.gameMessage('Unset your IL3 Character! Your synced benefits have been reset.');
    }

    if(player.il3CharName && il3CharName !== player.il3CharName) {
      if(await this.game.databaseManager.findPlayerWithIL3Name(il3CharName)) return this.gameError('That IL3 Character is already taken!');
    }

    player.il3CharName = il3CharName;

    const stats = await this.game.il3Linker.getIL3Stats(il3CharName);

    player.syncIL3(stats || {});
    this.gameMessage('You updated your IL3 Character!');

    this.game.updatePlayer(player);
  }
}


