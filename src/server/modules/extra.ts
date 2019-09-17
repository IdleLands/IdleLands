import { ServerEventName, ServerEvent } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class SubmitCustomItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ExtraSubmitItem;
  description = 'Submit a custom item, event, or string';
  args = 'itemString';

  async callback({ itemString } = { itemString: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(!itemString) return this.gameError('You did not submit an item.');

    // tslint:disable-next-line
    const itemRegex = /\[(?:newbie|basic|pro|idle|godly|goatly|omega) (?:body|charm|feet|finger|hands|head|legs|mainhand|neck|offhand|suffix|prefix)\] "[a-zA-Z0-9 ']+"(?: (?:str|dex|con|agi|int|luk|hp|xp|gold)=\-?[0-9]+)+/;

    // tslint:disable-next-line
    const eventRegex = /\[(?:event) (?:battle|blessGold|blessGoldParty|blessItem|blessXp|blessXpParty|enchant|findItem|flipStat|forsakeGold|forsakeItem|forsakeXp|levelDown|merchant|party|providence|tinker|witch)\] "[a-zA-Z0-9 ,;'%\.]+"/;

    if(!itemRegex.test(itemString)
    && !eventRegex.test(itemString)) return this.gameError('Invalid item/event/text string.');

    this.game.discordManager.submitCustomItem(player.name, itemString);

    this.gameMessage('You submitted a new item/event/string!');

    this.game.updatePlayer(player);
  }
}
