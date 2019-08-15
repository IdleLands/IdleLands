"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var BoosterSeat = /** @class */ (function (_super) {
    tslib_1.__extends(BoosterSeat, _super);
    function BoosterSeat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoosterSeat.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + "% STR for giving " + Math.pow(BoosterSeat.base, tier).toLocaleString() + " buffs out.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Booster Seat. Buff Scroll Duration +1h. Pet Attribute (Alchemist).";
        }
        return baseStr;
    };
    BoosterSeat.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Booster/Give');
        return Math.floor(interfaces_1.Achievement.log(steps, BoosterSeat.base));
    };
    BoosterSeat.rewardsForTier = function (tier) {
        var _a, _b;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {}, _a[interfaces_1.Stat.STR] = 1 + (tier * 0.01), _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Exhausted' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_b = {}, _b[interfaces_1.PermanentUpgrade.BuffScrollDuration] = 1, _b) });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.PetAttribute, petattr: interfaces_1.PetAttribute.Alchemist });
        }
        return baseRewards;
    };
    BoosterSeat.base = 3;
    BoosterSeat.statWatches = ['Character/Booster/Give'];
    BoosterSeat.type = interfaces_1.AchievementType.Special;
    return BoosterSeat;
}(interfaces_1.Achievement));
exports.BoosterSeat = BoosterSeat;
//# sourceMappingURL=BoosterSeat.js.map