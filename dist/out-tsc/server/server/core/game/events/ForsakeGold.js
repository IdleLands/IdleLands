"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var ForsakeGold = /** @class */ (function (_super) {
    tslib_1.__extends(ForsakeGold, _super);
    function ForsakeGold() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForsakeGold.prototype.operateOn = function (player) {
        var baseGoldLoss = this.rng.numberInRange(10, player.level.total * 50) - player.getStat(interfaces_1.Stat.LUK);
        // you always lose at least 1
        var goldLoss = Math.min(-1, -baseGoldLoss);
        var totalGoldLoss = player.gainGold(goldLoss);
        var eventText = this.eventText(interfaces_1.EventMessageType.ForsakeGold, player, { gold: Math.abs(totalGoldLoss) });
        var allText = eventText + " [" + totalGoldLoss.toLocaleString() + " gold]";
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Gold);
    };
    ForsakeGold.WEIGHT = 50;
    return ForsakeGold;
}(Event_1.Event));
exports.ForsakeGold = ForsakeGold;
//# sourceMappingURL=ForsakeGold.js.map