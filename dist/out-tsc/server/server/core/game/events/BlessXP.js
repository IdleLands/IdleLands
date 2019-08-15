"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var BlessXP = /** @class */ (function (_super) {
    tslib_1.__extends(BlessXP, _super);
    function BlessXP() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlessXP.prototype.operateOn = function (player) {
        if (player.$party && this.rng.likelihood(25)) {
            player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.BlessXPParty);
            return;
        }
        // you can't gain more than 5% of your xp at once
        var baseXPGain = this.rng.numberInRange(10 + player.getStat(interfaces_1.Stat.LUK), player.level.total * 25);
        var intermediateXPGain = Math.min(player.xp.maximum / 20, baseXPGain);
        var totalXPGain = player.gainXP(intermediateXPGain);
        var eventText = this.eventText(interfaces_1.EventMessageType.BlessXP, player, { xp: totalXPGain });
        var allText = eventText + " [+" + totalXPGain.toLocaleString() + " xp]";
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.XP);
    };
    BlessXP.WEIGHT = 100;
    return BlessXP;
}(Event_1.Event));
exports.BlessXP = BlessXP;
//# sourceMappingURL=BlessXP.js.map