"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Collector = /** @class */ (function (_super) {
    tslib_1.__extends(Collector, _super);
    function Collector() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Collector.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + "% to all stats for finding " + (tier * Collector.base).toLocaleString() + " collectibles.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Collector of Collectibles.";
        }
        return baseStr;
    };
    Collector.calculateTier = function (player) {
        var steps = player.$collectibles.getFoundCollectibles();
        return Math.floor(steps / Collector.base);
    };
    Collector.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.DEX] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.CON] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.INT] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.AGI] = 1 + (tier * 0.01),
                    _a[interfaces_1.Stat.LUK] = 1 + (tier * 0.01),
                    _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Collector of Collectibles' });
        }
        return baseRewards;
    };
    Collector.base = 25;
    Collector.statWatches = ['Item/Collectible/Find'];
    Collector.type = interfaces_1.AchievementType.Explore;
    return Collector;
}(interfaces_1.Achievement));
exports.Collector = Collector;
//# sourceMappingURL=Collector.js.map