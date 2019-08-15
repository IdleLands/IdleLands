"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Explorer = /** @class */ (function (_super) {
    tslib_1.__extends(Explorer, _super);
    function Explorer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Explorer.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 25 + " to all stats for exploring " + (tier * Explorer.base).toLocaleString() + " maps.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Explorer of Norkos.";
        }
        if (tier >= 15) {
            baseStr = baseStr + " Title: Explorer of Cabran.";
        }
        return baseStr;
    };
    Explorer.calculateTier = function (player) {
        var steps = player.$statistics.getChildrenCount('Map');
        return Math.floor(steps / Explorer.base);
    };
    Explorer.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Stats, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = tier * 25,
                    _a[interfaces_1.Stat.CON] = tier * 25,
                    _a[interfaces_1.Stat.INT] = tier * 25,
                    _a[interfaces_1.Stat.DEX] = tier * 25,
                    _a[interfaces_1.Stat.AGI] = tier * 25,
                    _a[interfaces_1.Stat.LUK] = tier * 25,
                    _a) },
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Explorer of Norkos' });
        }
        if (tier >= 15) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Explorer of Cabran' });
        }
        return baseRewards;
    };
    Explorer.base = 5;
    Explorer.statWatches = ['Game/Logins'];
    Explorer.type = interfaces_1.AchievementType.Explore;
    return Explorer;
}(interfaces_1.Achievement));
exports.Explorer = Explorer;
//# sourceMappingURL=Explorer.js.map