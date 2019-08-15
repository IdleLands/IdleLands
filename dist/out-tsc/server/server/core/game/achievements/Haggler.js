"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Haggler = /** @class */ (function (_super) {
    tslib_1.__extends(Haggler, _super);
    function Haggler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Haggler.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 5 + "% INT for selling " + Math.pow(Haggler.base, tier).toLocaleString() + " items.";
        if (tier >= 3) {
            baseStr = baseStr + " Personality: Intelligent.";
        }
        if (tier >= 5) {
            baseStr = baseStr + " Title: Hardy Haggler.";
        }
        return baseStr;
    };
    Haggler.calculateTier = function (player) {
        var steps = player.$statistics.get('Item/Sell/Times');
        return Math.floor(interfaces_1.Achievement.log(steps, Haggler.base));
    };
    Haggler.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.INT] = 1 + (tier * 0.05),
                    _a) }
        ];
        if (tier >= 3) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Personality, personality: 'Intelligent' });
        }
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Hardy Haggler' });
        }
        return baseRewards;
    };
    Haggler.base = 10;
    Haggler.statWatches = ['Item/Sell/Times'];
    Haggler.type = interfaces_1.AchievementType.Event;
    return Haggler;
}(interfaces_1.Achievement));
exports.Haggler = Haggler;
//# sourceMappingURL=Haggler.js.map