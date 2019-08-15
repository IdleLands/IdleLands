"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Comedian = /** @class */ (function (_super) {
    tslib_1.__extends(Comedian, _super);
    function Comedian() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Comedian.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + " achievement(s) for jesting " + Math.pow(Comedian.base, tier).toLocaleString() + " times.";
        if (tier >= 2) {
            baseStr = baseStr + " Personality: Lucky.";
        }
        if (tier >= 6) {
            baseStr = baseStr + " Title: Comedian.";
        }
        return baseStr;
    };
    Comedian.calculateTier = function (player) {
        var steps = player.$statistics.get('Profession/Jester/AbilityUses');
        return Math.floor(interfaces_1.Achievement.log(steps, Comedian.base));
    };
    Comedian.rewardsForTier = function (tier) {
        var baseRewards = [];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Lucky' });
        }
        if (tier >= 6) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Comedian' });
        }
        return baseRewards;
    };
    Comedian.base = 5;
    Comedian.statWatches = ['Profession/Jester/AbilityUses'];
    Comedian.type = interfaces_1.AchievementType.Special;
    return Comedian;
}(interfaces_1.Achievement));
exports.Comedian = Comedian;
//# sourceMappingURL=Comedian.js.map