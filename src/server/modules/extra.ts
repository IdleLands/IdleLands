import { ServerEventName, ServerEvent } from '../../shared/interfaces';
import { ServerSocketEvent } from '../../shared/models';

export class SubmitCustomItemEvent extends ServerSocketEvent implements ServerEvent {
  event = ServerEventName.ExtraSubmitItem;
  description = 'Submit a custom item.';
  args = 'itemString';

  async callback({ itemString } = { itemString: '' }) {
    const player = this.player;
    if(!player) return this.notConnected();

    if(!itemString) return this.gameError('You did not submit an item.');

    // tslint:disable-next-line
    const regex = /\[(?:newbie|basic|pro|idle|godly|goatly|omega) (?:body|charm|feet|finger|hands|head|legs|mainhand|neck|offhand)\] "[a-zA-Z0-9 ']+"(?: (?:str|dex|con|agi|int|luk|hp|xp|gold)=\-?[0-9]+)+/;
    if(!regex.test(itemString)) return this.gameError('Invalid item string.');

    this.game.discordManager.submitCustomItem(player.name, itemString);

    this.gameMessage('You submitted a new item!');

    this.game.updatePlayer(player);
  }
}
