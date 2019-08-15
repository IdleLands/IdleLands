"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Frail = /** @class */ (function (_super) {
    tslib_1.__extends(Frail, _super);
    function Frail() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Frail.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + "% CON for receiving " + Math.pow(Frail.base, tier).toLocaleString() + " injuries.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Spooky Skeleton. Injury Cap +1.";
        }
        return baseStr;
    };
    Frail.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Injury/Receive');
        return Math.floor(interfaces_1.Achievement.log(steps, Frail.base));
    };
    Frail.rewardsForTier = function (tier) {
        var _a, _b;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {}, _a[interfaces_1.Stat.CON] = 1 + (tier * 0.01), _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Spooky Skeleton' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_b = {}, _b[interfaces_1.PermanentUpgrade.InjuryThreshold] = 1, _b) });
        }
        return baseRewards;
    };
    Frail.base = 4;
    Frail.statWatches = ['Character/Injury/Receive'];
    Frail.type = interfaces_1.AchievementType.Combat;
    return Frail;
}(interfaces_1.Achievement));
exports.Frail = Frail;
//# sourceMappingURL=Frail.js.map