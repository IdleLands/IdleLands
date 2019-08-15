"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Divine = /** @class */ (function (_super) {
    tslib_1.__extends(Divine, _super);
    function Divine() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Divine.descriptionForTier = function (tier) {
        var baseStr = "Gain +" + tier + " stamina for moving divinely " + Math.pow(Divine.base, tier).toLocaleString() + " times.";
        if (tier >= 6) {
            baseStr = baseStr + " Title: Divine.";
        }
        return baseStr;
    };
    Divine.calculateTier = function (player) {
        var steps = player.$statistics.get('Character/Movement/Steps/Divine');
        return Math.floor(interfaces_1.Achievement.log(steps, Divine.base));
    };
    Divine.rewardsForTier = function (tier) {
        var _a;
        var baseRewards = [
            { type: interfaces_1.AchievementRewardType.PermanentUpgrade, upgrades: (_a = {}, _a[interfaces_1.PermanentUpgrade.MaxStaminaBoost] = tier, _a) }
        ];
        if (tier >= 6) {
            baseRewards.push({ type: interfaces_1.AchievementRewardType.Title, title: 'Divine' });
        }
        return baseRewards;
    };
    Divine.base = 5;
    Divine.statWatches = ['Character/Movement/Steps/Divine'];
    Divine.type = interfaces_1.AchievementType.Special;
    return Divine;
}(interfaces_1.Achievement));
exports.Divine = Divine;
//# sourceMappingURL=Divine.js.map