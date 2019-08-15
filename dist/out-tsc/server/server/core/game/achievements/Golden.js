"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Golden = /** @class */ (function (_super) {
    tslib_1.__extends(Golden, _super);
    function Golden() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Golden.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 3 + "% AGI for gaining and losing a total of " + Math.pow(Golden.base, tier).toLocaleString() + " gold.";
        if (tier >= 2) {
            baseStr = baseStr + " Personality: Greedy.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Golden Child. Pet Attribute: Golden.";
        }
        return baseStr;
    };
    Golden.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Gold/Gain') + player.$statistics.get('Character/Gold/Lose');
        return Math.floor(interfaces_1.Achievement.log(steps, Golden.base));
    };
    Golden.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.AGI] = 1 + (tier * 0.03),
                    _a) }
        ];
        if (tier >= 2) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Greedy' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Golden Child' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.PetAttribute, petattr: interfaces_1.PetAttribute.Golden });
        }
        return baseRewards;
    };
    Golden.base = 20;
    Golden.statWatches = ['Character/Gold/Gain', 'Character/Gold/Lose'];
    Golden.type = interfaces_1.AchievementType.Event;
    return Golden;
}(interfaces_1.Achievement));
exports.Golden = Golden;
//# sourceMappingURL=Golden.js.map