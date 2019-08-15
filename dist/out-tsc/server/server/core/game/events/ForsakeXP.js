"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var ForsakeXP = /** @class */ (function (_super) {
    tslib_1.__extends(ForsakeXP, _super);
    function ForsakeXP() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForsakeXP.prototype.operateOn = function (player) {
        // you can't lose more than 10% of your xp at once
        var baseXPLoss = this.rng.numberInRange(10, player.level.total * 50) - player.getStat(interfaces_1.Stat.LUK);
        var intermediateXPLoss = -Math.min(player.xp.maximum / 10, baseXPLoss);
        var totalXPLoss = player.gainXP(intermediateXPLoss);
        var eventText = this.eventText(interfaces_1.EventMessageType.ForsakeXP, player, { xp: Math.abs(totalXPLoss) });
        var allText = eventText + " [" + totalXPLoss.toLocaleString() + " xp]";
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.XP);
    };
    ForsakeXP.WEIGHT = 50;
    return ForsakeXP;
}(Event_1.Event));
exports.ForsakeXP = ForsakeXP;
//# sourceMappingURL=ForsakeXP.js.map