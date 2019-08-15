"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var PetUpgrader = /** @class */ (function (_super) {
    tslib_1.__extends(PetUpgrader, _super);
    function PetUpgrader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PetUpgrader.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + "% XP for upgrading your pets " + (tier * PetUpgrader.base).toLocaleString() + " time(s).";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Infuser. Pet Mission Cap +1. Pet Attribute (Surging).";
        }
        return baseStr;
    };
    PetUpgrader.calculateTier = function (player) {
        var steps = player.$statistics.get('Pet/Upgrade/Times');
        return Math.floor(steps / PetUpgrader.base);
    };
    PetUpgrader.rewardsForTier = function (tier) {
        var _a, _b;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.StatMultipliers, stats: (_a = {}, _a[interfaces_1.Stat.XP] = 1 + (tier * 0.01), _a) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Infuser' });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_b = {}, _b[interfaces_1.PermanentUpgrade.PetMissionCapBoost] = 1, _b) });
            baseRewards.push({ type: interfaces_1.AchievementRewardType.PetAttribute, petattr: interfaces_1.PetAttribute.Surging });
        }
        return baseRewards;
    };
    PetUpgrader.base = 5;
    PetUpgrader.statWatches = ['Pet/Upgrade/Times'];
    PetUpgrader.type = interfaces_1.AchievementType.Pet;
    return PetUpgrader;
}(interfaces_1.Achievement));
exports.PetUpgrader = PetUpgrader;
//# sourceMappingURL=PetUpgrader.js.map