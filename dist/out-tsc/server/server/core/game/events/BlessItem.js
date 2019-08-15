"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var BlessItem = /** @class */ (function (_super) {
    tslib_1.__extends(BlessItem, _super);
    function BlessItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlessItem.prototype.operateOn = function (player) {
        var stat = this.pickStat();
        var item = this.pickValidBlessItem(player);
        if (!item) {
            player.increaseStatistic("Event/BlessItem/Fail", 1);
            return;
        }
        item.stats[stat] = item.stats[stat] || 0;
        // boost item stat by 5% or 5, whichever is valid
        var boost = item.stats[stat] === 0 ? 5 : Math.max(3, Math.abs(Math.floor(item.stats[stat] / 20)));
        var eventText = this.eventText(interfaces_1.EventMessageType.BlessItem, player, { item: item.fullName() });
        var baseNum = item.stats[stat];
        var allText = eventText + " [" + stat.toUpperCase() + " " + baseNum.toLocaleString() + " \u2192 " + (baseNum + boost).toLocaleString() + "]";
        item.stats[stat] += boost;
        item.recalculateScore();
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Item);
    };
    BlessItem.WEIGHT = 150;
    return BlessItem;
}(Event_1.Event));
exports.BlessItem = BlessItem;
//# sourceMappingURL=BlessItem.js.map