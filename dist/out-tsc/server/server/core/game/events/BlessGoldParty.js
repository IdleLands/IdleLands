"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var BlessGoldParty = /** @class */ (function (_super) {
    tslib_1.__extends(BlessGoldParty, _super);
    function BlessGoldParty() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlessGoldParty.prototype.operateOn = function (player) {
        if (!player.$party)
            return;
        var goldGain = this.rng.numberInRange(10 + player.getStat(interfaces_1.Stat.LUK), player.level.total * 25);
        var totalGoldGain = player.gainGold(goldGain);
        var eventText = this.eventText(interfaces_1.EventMessageType.BlessGoldParty, player, { gold: totalGoldGain, partyName: player.$party.name });
        var allText = eventText + " [+" + totalGoldGain.toLocaleString() + " gold]";
        player.$$game.eventManager.emitStatGainsToPlayers(player.$party.members, { gold: totalGoldGain });
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Gold);
    };
    BlessGoldParty.WEIGHT = 0;
    return BlessGoldParty;
}(Event_1.Event));
exports.BlessGoldParty = BlessGoldParty;
//# sourceMappingURL=BlessGoldParty.js.map