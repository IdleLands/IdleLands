"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var BlessGold = /** @class */ (function (_super) {
    tslib_1.__extends(BlessGold, _super);
    function BlessGold() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlessGold.prototype.operateOn = function (player) {
        if (player.$party && this.rng.likelihood(25)) {
            player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.BlessGoldParty);
            return;
        }
        var goldGain = this.rng.numberInRange(10 + player.getStat(interfaces_1.Stat.LUK), player.level.total * 25);
        var totalGoldGain = player.gainGold(goldGain);
        var eventText = this.eventText(interfaces_1.EventMessageType.BlessGold, player, { gold: totalGoldGain });
        var allText = eventText + " [+" + totalGoldGain.toLocaleString() + " gold]";
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Gold);
    };
    BlessGold.WEIGHT = 100;
    return BlessGold;
}(Event_1.Event));
exports.BlessGold = BlessGold;
//# sourceMappingURL=BlessGold.js.map