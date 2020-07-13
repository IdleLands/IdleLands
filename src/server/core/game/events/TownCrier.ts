import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';

const townCrierMessages = [
  {
    message: 'Got questions? Are some aspects of IdleLands confusing? Worry not, check out the FAQ!',
    link: 'https://idle.land/docs/faq/',
    origin: 'system'
  },
  {
    message: 'Need help? There\'s a lot of docs on idle.land, check them out!',
    link: 'https://idle.land/docs/home/',
    origin: 'system'
  },
  {
    message: 'Found a bug? Can you reproduce a bug I can\'t? Great! Get ILP or Gold for giving me some reproduction steps!',
    link: 'https://idle.land/docs/bug-bounties/',
    origin: 'system'
  },
  {
    message: 'Want to join our Discord server? Come check it out!',
    link: 'https://discord.gg/USwJW4y',
    origin: 'system'
  },
  {
    message: 'Interested in contributing content or maps to IdleLands? Check out the Github!',
    link: 'https://github.com/IdleLands',
    origin: 'system'
  },
  {
    message: 'Want to join our community on reddit? Head on over to /r/idle_lands!',
    link: 'https://www.reddit.com/r/idle_lands/',
    origin: 'system'
  },
  {
    message: 'Want to keep up with the game? Follow @IdleLands on Twitter!',
    link: 'https://twitter.com/IdleLands',
    origin: 'system'
  },
  {
    message: 'Want to keep up with the game? Follow @IdleLands on Facebook!',
    link: 'https://facebook.com/IdleLands',
    origin: 'system'
  },
  {
    message: 'Want to support the game even more? Support Seiyria on Patreon!',
    link: 'https://www.patreon.com/seiyria',
    origin: 'system'
  },
  {
    message: `Interested in Seiyria's other projects?
    Check out Land of the Rair! It's not an idle game, but rather is a fully playable (alpha) MORPG.`,
    link: 'https://rair.land',
    origin: 'system'
  },
  {
    message: `Looking for a single player incremental to manage heroes and send them on adventures?
    Check out Rasterkhann - it's a single player incremental made by the creator of IdleLands!`,
    link: 'https://rasterkhann.com',
    origin: 'system'
  },
  {
    message: `Want to see the global leaderboards? Check it out!`,
    link: 'https://global.idle.land/leaderboard',
    origin: 'system'
  },
];

export class TownCrier extends Event {
  public static readonly WEIGHT = 15;

  public operateOn(player: Player) {
    const message = this.rng.pickone(townCrierMessages);
    this.emitMessage([player], message.message, AdventureLogEventType.TownCrier, { link: message.link });
  }
}
