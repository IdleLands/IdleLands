"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Tired = /** @class */ (function (_super) {
    tslib_1.__extends(Tired, _super);
    function Tired() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Tired.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + " Adventure Log Capacity\n                   and +" + tier * 2 + " Max Stamina for using " + Math.pow(Tired.base, tier).toLocaleString() + " stamina.";
        if (tier >= 5) {
            baseStr = baseStr + " Title: Exhausted.";
        }
        return baseStr;
    };
    Tired.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Stamina/Spend');
        return Math.floor(interfaces_1.Achievement.log(steps, Tired.base));
    };
    Tired.rewardsForTier = function (tier) {
        var _a, _b;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.AdventureLogSizeBoost] = tier, _a) },
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_b = {}, _b[interfaces_1.PermanentUpgrade.MaxStaminaBoost] = tier * 2, _b) }
        ];
        if (tier >= 5) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Exhausted' });
        }
        return baseRewards;
    };
    Tired.base = 10;
    Tired.statWatches = ['Character/Stamina/Spend'];
    Tired.type = interfaces_1.AchievementType.Special;
    return Tired;
}(interfaces_1.Achievement));
exports.Tired = Tired;
//# sourceMappingURL=Tired.js.map