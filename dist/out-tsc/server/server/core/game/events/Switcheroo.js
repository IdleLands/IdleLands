"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var Switcheroo = /** @class */ (function (_super) {
    tslib_1.__extends(Switcheroo, _super);
    function Switcheroo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Switcheroo.prototype.operateOn = function (player) {
        var stat = this.pickStat();
        var item = this.pickValidItem(player);
        if (!item || !item.stats[stat]) {
            player.increaseStatistic("Event/Switcheroo/Fail", 1);
            return;
        }
        var eventText = this.eventText(interfaces_1.EventMessageType.Switcheroo, player, { item: item.fullName(), stat: stat });
        var allText = eventText + " [" + stat.toUpperCase() + " " + item.stats[stat] + " \u2192 " + -item.stats[stat] + "]";
        item.stats[stat] = -item.stats[stat];
        item.recalculateScore();
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Item);
    };
    Switcheroo.WEIGHT = 1;
    return Switcheroo;
}(Event_1.Event));
exports.Switcheroo = Switcheroo;
//# sourceMappingURL=Switcheroo.js.map