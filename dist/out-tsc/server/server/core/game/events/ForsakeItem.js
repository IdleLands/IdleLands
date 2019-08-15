"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var ForsakeItem = /** @class */ (function (_super) {
    tslib_1.__extends(ForsakeItem, _super);
    function ForsakeItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ForsakeItem.prototype.operateOn = function (player) {
        var stat = this.pickStat();
        var item = this.pickValidBlessItem(player);
        if (!item) {
            player.increaseStatistic("Event/ForsakeItem/Fail", 1);
            return;
        }
        item.stats[stat] = item.stats[stat] || 0;
        // boost item stat by 5% or 5, whichever is valid
        var boost = item.stats[stat] === 0 ? 5 : Math.max(3, Math.abs(Math.floor(item.stats[stat] / 20)));
        var eventText = this.eventText(interfaces_1.EventMessageType.ForsakeItem, player, { item: item.fullName() });
        var baseNum = item.stats[stat];
        var allText = eventText + " [" + stat.toUpperCase() + " " + baseNum.toLocaleString() + " \u2192 " + (baseNum - boost).toLocaleString() + "]";
        item.stats[stat] -= boost;
        item.recalculateScore();
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Item);
    };
    ForsakeItem.WEIGHT = 75;
    return ForsakeItem;
}(Event_1.Event));
exports.ForsakeItem = ForsakeItem;
//# sourceMappingURL=ForsakeItem.js.map