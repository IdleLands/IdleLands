"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Quickfooted = /** @class */ (function (_super) {
    tslib_1.__extends(Quickfooted, _super);
    function Quickfooted() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Quickfooted.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% AGI for dodging " + Math.pow(Quickfooted.base, tier).toLocaleString() + " times.";
        if (tier >= 3) {
            baseStr = baseStr + " Personality: Agile.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Fleet of Foot.";
        }
        return baseStr;
    };
    Quickfooted.calculateTier = function (player) {
        var steps = player.$statistics.get('Combat/All/Receive/Miss');
        return Math.floor(interfaces_1.Achievement.log(steps, Quickfooted.base));
    };
    Quickfooted.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.AGI] = 1 + (tier * 0.05),
                    _a) }
        ];
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Agile' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Fleet of Foot' });
        }
        return baseRewards;
    };
    Quickfooted.base = 10;
    Quickfooted.statWatches = ['Combat/All/Receive/Miss'];
    Quickfooted.type = interfaces_1.AchievementType.Combat;
    return Quickfooted;
}(interfaces_1.Achievement));
exports.Quickfooted = Quickfooted;
//# sourceMappingURL=Quickfooted.js.map