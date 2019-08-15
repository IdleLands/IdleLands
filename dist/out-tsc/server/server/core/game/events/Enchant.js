"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var Enchant = /** @class */ (function (_super) {
    tslib_1.__extends(Enchant, _super);
    function Enchant() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Enchant.prototype.operateOn = function (player) {
        var item = this.pickValidEnchantItem(player);
        if (!item) {
            this.emitMessage([player], 'You almost received an enchant, but it fizzled.', interfaces_1.AdventureLogEventType.Item);
            player.increaseStatistic("Event/Enchant/Fail", 1);
            return;
        }
        var choice = this.rng.chance.weighted([interfaces_1.EventMessageType.Tinker, interfaces_1.EventMessageType.Enchant], [0.15, 0.85]);
        var eventText = this.eventText(choice, player, { item: item.fullName() });
        var stat = this.pickStat();
        var boost = 25;
        if (choice === interfaces_1.EventMessageType.Tinker) {
            stat = this.pickTinkerStat();
            boost = stat === interfaces_1.Stat.HP ? 200 : 2;
        }
        var baseNum = item.stats[stat] || 0;
        var allText = eventText + " [" + stat.toUpperCase() + " " + baseNum.toLocaleString() + " \u2192 " + (baseNum + boost).toLocaleString() + "]";
        item.enchantLevel = item.enchantLevel || 0;
        item.stats[stat] = item.stats[stat] || 0;
        item.enchantLevel++;
        item.stats[stat] += boost;
        item.recalculateScore();
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Item);
    };
    Enchant.WEIGHT = 3;
    return Enchant;
}(Event_1.Event));
exports.Enchant = Enchant;
//# sourceMappingURL=Enchant.js.map