"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Boxer = /** @class */ (function (_super) {
    tslib_1.__extends(Boxer, _super);
    function Boxer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Boxer.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 3 + "% DEX/INT for touching " + (tier * Boxer.base).toLocaleString() + " treasure chests.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Boxer.";
        }
        return baseStr;
    };
    Boxer.calculateTier = function (player) {
        var steps = player.$statistics.get('Treasure/Total/Touch');
        return Math.floor(steps / Boxer.base);
    };
    Boxer.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.DEX] = 1 + (tier * 0.03),
                    _a[interfaces_1.Stat.INT] = 1 + (tier * 0.03),
                    _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Bodacious Boxer' });
        }
        return baseRewards;
    };
    Boxer.base = 25;
    Boxer.statWatches = ['Treasure/Total/Touch'];
    Boxer.type = interfaces_1.AchievementType.Explore;
    return Boxer;
}(interfaces_1.Achievement));
exports.Boxer = Boxer;
//# sourceMappingURL=Boxer.js.map