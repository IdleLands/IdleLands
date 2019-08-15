"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Goldsent = /** @class */ (function (_super) {
    tslib_1.__extends(Goldsent, _super);
    function Goldsent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Goldsent.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% GOLD for ascending with a total of " + Math.pow(Goldsent.base, tier).toLocaleString() + " gold.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Goldsent.";
        }
        return baseStr;
    };
    Goldsent.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Ascension/Gold');
        return Math.floor(interfaces_1.Achievement.log(steps, Goldsent.base));
    };
    Goldsent.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.GOLD] = 1 + (tier * 0.05),
                    _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Goldsent' });
        }
        return baseRewards;
    };
    Goldsent.base = 20;
    Goldsent.statWatches = ['Character/Ascension/Gold'];
    Goldsent.type = interfaces_1.AchievementType.Special;
    return Goldsent;
}(interfaces_1.Achievement));
exports.Goldsent = Goldsent;
//# sourceMappingURL=Goldsent.js.map