"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Muscled = /** @class */ (function (_super) {
    tslib_1.__extends(Muscled, _super);
    function Muscled() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Muscled.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% STR for equipping " + Math.pow(Muscled.base, tier).toLocaleString() + " items.";
        if (tier >= 3) {
            baseStr = baseStr + " Personality: Strong.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Strong-armed Sparkler.";
        }
        return baseStr;
    };
    Muscled.calculateTier = function (player) {
        var steps = player.$statistics.get('Item/Equip/Times');
        return Math.floor(interfaces_1.Achievement.log(steps, Muscled.base));
    };
    Muscled.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.STR] = 1 + (tier * 0.05),
                    _a) }
        ];
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Strong' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Strong-armed Sparkler' });
        }
        return baseRewards;
    };
    Muscled.base = 10;
    Muscled.statWatches = ['Item/Equip/Times'];
    Muscled.type = interfaces_1.AchievementType.Event;
    return Muscled;
}(interfaces_1.Achievement));
exports.Muscled = Muscled;
//# sourceMappingURL=Muscled.js.map