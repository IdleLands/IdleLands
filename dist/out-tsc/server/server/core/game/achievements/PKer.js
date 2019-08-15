"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var PKer = /** @class */ (function (_super) {
    tslib_1.__extends(PKer, _super);
    function PKer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PKer.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 3 + "% DEX/AGI for killing " + Math.pow(PKer.base, tier).toLocaleString() + " players.";
        if (tier >= 3) {
            baseStr = baseStr + " Title: Killer of Players.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Slayer of Men (and Women).";
        }
        return baseStr;
    };
    PKer.calculateTier = function (player) {
        var steps = player.$statistics.get('Combat/All/Kill/Player');
        return Math.floor(interfaces_1.Achievement.log(steps, PKer.base));
    };
    PKer.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.DEX] = 1 + (tier * 0.03),
                    _a[interfaces_1.Stat.AGI] = 1 + (tier * 0.03),
                    _a) }
        ];
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Killer of Players' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Slayer of Men (and Women)' });
        }
        return baseRewards;
    };
    PKer.base = 10;
    PKer.statWatches = ['Combat/All/Kill/Player'];
    PKer.type = interfaces_1.AchievementType.Combat;
    return PKer;
}(interfaces_1.Achievement));
exports.PKer = PKer;
//# sourceMappingURL=PKer.js.map