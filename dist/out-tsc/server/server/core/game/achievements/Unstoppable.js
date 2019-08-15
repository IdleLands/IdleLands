"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Unstoppable = /** @class */ (function (_super) {
    tslib_1.__extends(Unstoppable, _super);
    function Unstoppable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Unstoppable.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% STR for giving out " + Math.pow(Unstoppable.base, tier).toLocaleString() + " damage.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Terror Train.";
        }
        return baseStr;
    };
    Unstoppable.calculateTier = function (player) {
        var steps = player.$statistics.get('Combat/All/Give/Damage');
        return Math.floor(interfaces_1.Achievement.log(steps, Unstoppable.base));
    };
    Unstoppable.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = 1 + (tier * 0.05),
                    _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Terror Train' });
        }
        return baseRewards;
    };
    Unstoppable.base = 10;
    Unstoppable.statWatches = ['Combat/All/Give/Damage'];
    Unstoppable.type = interfaces_1.AchievementType.Combat;
    return Unstoppable;
}(interfaces_1.Achievement));
exports.Unstoppable = Unstoppable;
//# sourceMappingURL=Unstoppable.js.map