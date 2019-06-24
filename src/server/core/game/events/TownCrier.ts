import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

const townCrierMessages = [
  {
    message: 'Got questions? Are some aspects of IdleLands confusing? Worry not, check out the FAQ!',
    link: 'https://github.com/IdleLands/IdleLands/wiki/FAQ',
    origin: 'system'
  },
  {
    message: 'Found a bug? Can you reproduce a bug I can\'t? Great! Get ILP or Gold for giving me some reproduction steps!',
    link: 'https://github.com/IdleLands/IdleLands/wiki/Bug-Bounties',
    origin: 'system'
  },
  {
    message: 'Want to join our Discord server? Come check it out!',
    link: 'https://discord.gg/USwJW4y',
    origin: 'system'
  },
  {
    message: `Interested in what Seiyria has been up to lately?
    Check out Land of the Rair! It's not an idle game, but rather is a fully playable (alpha) MORPG.`,
    link: 'https://rair.land',
    origin: 'system'
  },
];

export class TownCrier extends Event {
  public static readonly WEIGHT = 15;

  public operateOn(player: Player) {
    const message = this.rng.pickone(townCrierMessages);
    this.emitMessage([player], message.message, AdventureLogEventType.TownCrier, message.link);
  }
}
