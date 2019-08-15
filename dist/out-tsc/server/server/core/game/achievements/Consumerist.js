"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Consumerist = /** @class */ (function (_super) {
    tslib_1.__extends(Consumerist, _super);
    function Consumerist() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Consumerist.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 2 + "% GOLD and +" + tier * 3 + "% DEX for spending " + Math.pow(Consumerist.base, tier).toLocaleString() + " gold.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Consumerist.";
        }
        return baseStr;
    };
    Consumerist.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Gold/Spend');
        return Math.floor(interfaces_1.Achievement.log(steps, Consumerist.base));
    };
    Consumerist.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.GOLD] = 1 + (tier * 0.02),
                    _a[interfaces_1.Stat.DEX] = 1 + (tier * 0.03),
                    _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Consumerist' });
        }
        return baseRewards;
    };
    Consumerist.base = 10;
    Consumerist.statWatches = ['Character/Gold/Spend'];
    Consumerist.type = interfaces_1.AchievementType.Event;
    return Consumerist;
}(interfaces_1.Achievement));
exports.Consumerist = Consumerist;
//# sourceMappingURL=Consumerist.js.map