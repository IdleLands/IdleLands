"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Walker = /** @class */ (function (_super) {
    tslib_1.__extends(Walker, _super);
    function Walker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Walker.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + " XP and +" + tier + " GOLD for walking " + Math.pow(Walker.base, tier).toLocaleString() + " steps.";
        if (tier >= 2) {
            baseStr = baseStr + " Personality: ScaredOfTheDark/Delver.";
        }
        if (tier >= 3) {
            baseStr = baseStr + " Personality: Camping.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Walker.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Taxes Ranger.";
        }
        return baseStr;
    };
    Walker.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Ticks');
        return Math.floor(interfaces_1.Achievement.log(steps, Walker.base));
    };
    Walker.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Stats, stats: (_a = {}, _a[interfaces_1.Stat.GOLD] = tier, _a[interfaces_1.Stat.XP] = tier, _a) }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'ScaredOfTheDark' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Delver' });
        }
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Camping' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.DeathMessage, message: '%player stepped away into death.' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Walker' });
        }
        if (tier >= 6) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Taxes Ranger' });
        }
        return baseRewards;
    };
    Walker.base = 10;
    Walker.statWatches = ['Character/Ticks'];
    Walker.type = interfaces_1.AchievementType.Progress;
    return Walker;
}(interfaces_1.Achievement));
exports.Walker = Walker;
//# sourceMappingURL=Walker.js.map