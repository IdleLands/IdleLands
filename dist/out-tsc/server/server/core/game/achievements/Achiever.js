"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Achiever = /** @class */ (function (_super) {
    tslib_1.__extends(Achiever, _super);
    function Achiever() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Achiever.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + " achievement tiers for achieving " + (tier * Achiever.base).toLocaleString() + " achievements. Achievements.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Overachiever.";
        }
        return baseStr;
    };
    Achiever.calculateTier = function (player) {
        var steps = player.$achievements.totalAchievementTiers();
        return Math.floor(steps / Achiever.base);
    };
    Achiever.rewardsForTier = function (tier) {
        var baseRewards = [];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Achiever' });
        }
        return baseRewards;
    };
    Achiever.base = 30;
    Achiever.statWatches = ['Game/Logins'];
    Achiever.type = interfaces_1.AchievementType.Progress;
    return Achiever;
}(interfaces_1.Achievement));
exports.Achiever = Achiever;
//# sourceMappingURL=Achiever.js.map