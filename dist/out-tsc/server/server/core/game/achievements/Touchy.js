"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Touchy = /** @class */ (function (_super) {
    tslib_1.__extends(Touchy, _super);
    function Touchy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Touchy.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + "% XP for touching " + Math.pow(Touchy.base, tier).toLocaleString() + " collectibles.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Touchy Feely.";
        }
        return baseStr;
    };
    Touchy.calculateTier = function (player) {
        var steps = player.$statistics.get('Item/Collectible/Touch');
        return Math.floor(interfaces_1.Achievement.log(steps, Touchy.base));
    };
    Touchy.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {}, _a[interfaces_1.Stat.XP] = 1 + (tier * 0.01), _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.DeathMessage, message: '%player touched death. Death touched back.' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Touchy Feely' });
        }
        return baseRewards;
    };
    Touchy.base = 10;
    Touchy.statWatches = ['Item/Collectible/Touch'];
    Touchy.type = interfaces_1.AchievementType.Event;
    return Touchy;
}(interfaces_1.Achievement));
exports.Touchy = Touchy;
//# sourceMappingURL=Touchy.js.map