"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Herder = /** @class */ (function (_super) {
    tslib_1.__extends(Herder, _super);
    function Herder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Herder.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + "% STR for buying " + (tier * Herder.base).toLocaleString() + " pet(s).";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Herder.";
        }
        return baseStr;
    };
    Herder.calculateTier = function (player) {
        var steps = player.$statistics.get('Pet/Buy/Times');
        return Math.floor(steps / Herder.base);
    };
    Herder.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {}, _a[interfaces_1.Stat.STR] = 1 + (tier * 0.01), _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Herder' });
        }
        return baseRewards;
    };
    Herder.base = 5;
    Herder.statWatches = ['Pet/Buy/Times'];
    Herder.type = interfaces_1.AchievementType.Pet;
    return Herder;
}(interfaces_1.Achievement));
exports.Herder = Herder;
//# sourceMappingURL=Herder.js.map