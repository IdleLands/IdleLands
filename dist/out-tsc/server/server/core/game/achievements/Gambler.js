"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Gambler = /** @class */ (function (_super) {
    tslib_1.__extends(Gambler, _super);
    function Gambler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Gambler.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier * 3 + "% LUK for spending " + Math.pow(Gambler.base, tier).toLocaleString() + " gold on gambling.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Two-headed Coin.";
        }
        return baseStr;
    };
    Gambler.calculateTier = function (player) {
        var steps = player.$statistics.get('Event/Gamble/Wager');
        return Math.floor(interfaces_1.Achievement.log(steps, Gambler.base));
    };
    Gambler.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {},
                    _a[interfaces_1.Stat.LUK] = 1 + (tier * 0.03),
                    _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Two-headed Coin' });
        }
        return baseRewards;
    };
    Gambler.base = 10;
    Gambler.statWatches = ['Event/Gamble/Wager'];
    Gambler.type = interfaces_1.AchievementType.Event;
    return Gambler;
}(interfaces_1.Achievement));
exports.Gambler = Gambler;
//# sourceMappingURL=Gambler.js.map