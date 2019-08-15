"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Swinger = /** @class */ (function (_super) {
    tslib_1.__extends(Swinger, _super);
    function Swinger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Swinger.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% DEX for attacking " + Math.pow(Swinger.base, tier).toLocaleString() + " times.";
        if (tier >= 3) {
            baseStr = baseStr + " Personality: Dextrous.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Fastidious Fencer.";
        }
        return baseStr;
    };
    Swinger.calculateTier = function (player) {
        var steps = player.$statistics.get('Combat/All/Give/Attack/Times');
        return Math.floor(interfaces_1.Achievement.log(steps, Swinger.base));
    };
    Swinger.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.DEX] = 1 + (tier * 0.05),
                    _a) }
        ];
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Dextrous' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Fastidious Fencer' });
        }
        return baseRewards;
    };
    Swinger.base = 10;
    Swinger.statWatches = ['Combat/All/Give/Attack/Times'];
    Swinger.type = interfaces_1.AchievementType.Combat;
    return Swinger;
}(interfaces_1.Achievement));
exports.Swinger = Swinger;
//# sourceMappingURL=Swinger.js.map