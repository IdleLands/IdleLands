"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Ascended = /** @class */ (function (_super) {
    tslib_1.__extends(Ascended, _super);
    function Ascended() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ascended.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% more XP and GOLD for ascending " + tier + " time(s). Title: Ascended.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Arisen.";
        }
        if (tier >= 10) {
            baseStr = baseStr + " Title: Rerisen.";
        }
        if (tier >= 15) {
            baseStr = baseStr + " Title: True.";
        }
        if (tier >= 20) {
            baseStr = baseStr + " Title: Truer.";
        }
        if (tier >= 25) {
            baseStr = baseStr + " Title: Truest.";
        }
        if (tier >= 50) {
            baseStr = baseStr + " Title: Ascended\u00B2.";
        }
        return baseStr;
    };
    Ascended.calculateTier = function (player) {
        return player.ascensionLevel;
    };
    Ascended.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.Title, title: 'Ascended' },
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.XP] = 1 + (tier * 0.05),
                    _a[interfaces_1.Stat.GOLD] = 1 + (tier * 0.05),
                    _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Arisen' });
        }
        if (tier >= 10) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Rerisen' });
        }
        if (tier >= 15) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'True' });
        }
        if (tier >= 20) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Truer' });
        }
        if (tier >= 25) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Truest' });
        }
        if (tier >= 50) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Ascended²' });
        }
        return baseRewards;
    };
    Ascended.base = 30;
    Ascended.statWatches = ['Character/Ascension/Times'];
    Ascended.type = interfaces_1.AchievementType.Progress;
    return Ascended;
}(interfaces_1.Achievement));
exports.Ascended = Ascended;
//# sourceMappingURL=Ascended.js.map