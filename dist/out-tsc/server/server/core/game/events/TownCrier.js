"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var townCrierMessages = [
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
        message: "Interested in Seiyria's other projects?\n    Check out Land of the Rair! It's not an idle game, but rather is a fully playable (alpha) MORPG.",
        link: 'https://rair.land',
        origin: 'system'
    },
];
var TownCrier = /** @class */ (function (_super) {
    tslib_1.__extends(TownCrier, _super);
    function TownCrier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TownCrier.prototype.operateOn = function (player) {
        var message = this.rng.pickone(townCrierMessages);
        this.emitMessage([player], message.message, interfaces_1.AdventureLogEventType.TownCrier, { link: message.link });
    };
    TownCrier.WEIGHT = 15;
    return TownCrier;
}(Event_1.Event));
exports.TownCrier = TownCrier;
//# sourceMappingURL=TownCrier.js.map