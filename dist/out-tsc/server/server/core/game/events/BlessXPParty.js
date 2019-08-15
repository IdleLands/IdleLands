"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var BlessXPParty = /** @class */ (function (_super) {
    tslib_1.__extends(BlessXPParty, _super);
    function BlessXPParty() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlessXPParty.prototype.operateOn = function (player) {
        if (!player.$party)
            return;
        // you can't gain more than 5% of your xp at once
        var baseXPGain = this.rng.numberInRange(10 + player.getStat(interfaces_1.Stat.LUK), player.level.total * 25);
        var intermediateXPGain = Math.min(player.xp.maximum / 20, baseXPGain);
        var totalXPGain = player.gainXP(intermediateXPGain);
        var eventText = this.eventText(interfaces_1.EventMessageType.BlessXPParty, player, { xp: totalXPGain, partyName: player.$party.name });
        var allText = eventText + " [+" + totalXPGain.toLocaleString() + " xp]";
        player.$$game.eventManager.emitStatGainsToPlayers(player.$party.members, { xp: totalXPGain });
        this.emitMessageToNames(player.$party.members, allText, interfaces_1.AdventureLogEventType.XP);
    };
    BlessXPParty.WEIGHT = 0;
    return BlessXPParty;
}(Event_1.Event));
exports.BlessXPParty = BlessXPParty;
//# sourceMappingURL=BlessXPParty.js.map